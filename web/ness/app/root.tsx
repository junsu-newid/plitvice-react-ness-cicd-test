import { ReactNode } from 'react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { Route } from './+types/root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalProvider } from './hooks/useGlobal.context';
import { ToastProvider } from '@plitvice/ui';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales';
import '@plitvice/ui/styles/global.css';

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
            <body>
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
    return <Outlet />;
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
