import { ReactNode, Suspense, useMemo } from 'react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigate } from 'react-router';
import type { Route } from './+types/root';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '@/locales';
import { GlobalProvider, useGlobalContext } from '@/hooks/useGlobal.context.tsx';
import { ToastProvider } from '@plitvice/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@plitvice/ui/styles/global.css';
import LoadingMask from '@/app/LoadingMask.tsx';
import FileUploadsPage from '@/pages/fileUploads';
import { SideNavBar } from '@plitvice/ui/components/navigation/SideNavBar.tsx';
import { TFunction } from 'i18next';
import { SideNavSection } from '@plitvice/ui/components/navigation/sideNavBar.types.ts';

export const links: Route.LinksFunction = () => [];

const queryClient = new QueryClient();

export function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Ness</title>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/svg+xml" href="/favicon.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <div className={`col-span-2 bg-blue-600 px-[24px] py-[16px]`}>
                    <a href={`./`}>
                        <img src={`/logo.png`} width={110} height={28} alt={'logo'} />
                    </a>
                </div>
                <I18nextProvider i18n={i18n}>
                    <QueryClientProvider client={queryClient}>
                        <GlobalProvider>
                            <ToastProvider>{children}</ToastProvider>
                        </GlobalProvider>
                    </QueryClientProvider>
                </I18nextProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const { t } = useTranslation();
    const { userId } = useGlobalContext();
    const navMap = useMemo(() => {
        const map = getNavMap(t);
        if (userId !== 'minho') {
            map.pop();
        }
        return map;
    }, [t, userId]);
    const navigate = useNavigate();

    return (
        <div className={'relative grid h-full w-full grid-cols-[240px_1fr] justify-start overflow-hidden'}>
            {userId !== 'cp' ? (
                <>
                    <div className={`h-full overflow-y-auto pb-[48px] pt-[24px]`}>
                        <SideNavBar width={0} sectionList={navMap} onNavigate={navigate} />
                    </div>
                    <div className={'bg-grey-5 border-grey-20 relative h-full w-full overflow-auto border-l'}>
                        <Suspense fallback={<LoadingMask />}>
                            <Outlet />
                        </Suspense>
                        <LoadingMask />
                    </div>{' '}
                </>
            ) : (
                <>
                    <div className={`col-span-2 h-full w-full overflow-hidden`}>
                        <FileUploadsPage />
                    </div>
                    <LoadingMask />
                </>
            )}
        </div>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="container mx-auto p-4 pt-16">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full overflow-x-auto p-4">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}

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
