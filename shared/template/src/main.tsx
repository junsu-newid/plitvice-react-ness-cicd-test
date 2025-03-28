import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { theme } from '@plitvice/ui';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locale';
import App from './App.tsx';
import '@plitvice/ui/styles/index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </I18nextProvider>
    </StrictMode>,
);
