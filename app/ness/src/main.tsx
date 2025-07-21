import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales';
import '@plitvice/ui/styles/global.css';
import '@/styles/global.css';
import AppRouter from '@/app/router.tsx';
import { ToastProvider } from '@plitvice/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <AppRouter />
                </ToastProvider>
            </QueryClientProvider>
        </I18nextProvider>
    </StrictMode>,
);
