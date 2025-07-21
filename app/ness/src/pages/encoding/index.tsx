import { TFunction } from 'i18next';
import { SideNavSection } from '@plitvice/ui/components/navigation/sideNavBar.types.ts';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import Layout from '@/app/Layout.tsx';
import { SideNavBar } from '@plitvice/ui/components/navigation/SideNavBar.tsx';
import { FileUploadsProvider } from '@/pages/encoding/FileUploadsContext.tsx';

function HomeLayout() {
    const { t } = useTranslation();
    const navMap = useMemo(() => getNavMap(t), [t]);
    const navigate = useNavigate();
    // const { isAuthenticated, isLoading, error, authenticate } = useUser();

    return (
        <FileUploadsProvider>
            <Layout>
                <div className={`h-full overflow-y-auto pb-[48px] pt-[24px]`}>
                    <SideNavBar width={0} sectionList={navMap} onNavigate={navigate} />
                </div>
            </Layout>
        </FileUploadsProvider>
    );
}
export default HomeLayout;

const getNavMap = (t: TFunction): SideNavSection[] => {
    return [
        {
            title: t('nav.home.encoding.title'),
            child: [
                { path: '/', label: t('nav.home.encoding.fileUploads') },
                { path: '/queue-status', label: t('nav.home.encoding.queueStatus') },
            ],
        },
        {
            title: t('nav.home.operations.title'),
            child: [
                { path: '/server-status', label: t('nav.home.operations.serverStatus') },
                { path: '/preset-list', label: t('nav.home.operations.presetList') },
            ],
        },
    ];
};
