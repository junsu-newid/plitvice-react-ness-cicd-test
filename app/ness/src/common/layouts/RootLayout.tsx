import { SideNavBar } from '@plitvice/ui';
import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { getUserId } from '@/utils';
import { useUser } from '@/hooks/useUser';

const RootLayout = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, error, authenticate } = useUser();

    useEffect(() => {
        authenticate(getUserId);
    }, [authenticate]);

    // Error state component
    const ErrorView = () => (
        <div className="flex h-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-primary mb-4 text-2xl font-bold">403 Forbidden</h1>
                <div>{error}</div>
            </div>
        </div>
    );

    // Loading state component
    const LoadingView = () => (
        <div className="flex h-full items-center justify-center">
            <div>로딩 중...</div>
        </div>
    );

    // Main content renderer
    const renderContent = () => {
        if (error) return <ErrorView />;
        if (isLoading || !isAuthenticated) return <LoadingView />;
        return <Outlet />;
    };

    return (
        <div className="flex h-full min-h-screen w-full pt-[40px] min-[991px]:pt-[61.5px]">
            <SideNavBar
                onNavigate={navigate}
                sectionList={[
                    {
                        title: '',
                        child: [
                            { path: '/', label: 'File Upload' },
                            { path: '/file-list', label: 'Encoded File List' },
                        ],
                    },
                    {
                        title: 'Operations',
                        child: [
                            { path: '/server-status', label: 'Encoding Server Status' },
                            { path: '/preset-list', label: 'Encoding Preset List' },
                        ],
                    },
                ]}
            />

            <div className="bg-grey-5 relative flex-1 overflow-auto px-3 min-[991px]:px-9">
                {import.meta.env.VITE_ENV === 'local' && (
                    <div className="bg-primary fixed left-0 right-0 top-0 flex h-[40px] w-full items-center px-3 min-[991px]:h-[61.5px]">
                        <div>
                            <img
                                src={`https://cdn88-accio.its-newid.net/ci/playout_plus/v1/nav_logo.png`}
                                className="h-[28px] w-[110px]"
                                alt="logo"
                            />
                        </div>
                    </div>
                )}

                {renderContent()}
            </div>
        </div>
    );
};

export default RootLayout;
