import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from '../src';

const preview: Preview = {
    // 모든 story 공통 지정
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i, // 색상 선택기 적용
                date: /Date$/i, // 날짜 선택기를 적용
            },
        },
    },
    // styled-components의 theme와 globalStyle 적용
    decorators: [
        (Story, context) => {
            return (
                <ThemeProvider theme={theme}>
                    <GlobalStyle />
                    <Story {...context} />
                </ThemeProvider>
            );
        },
    ],
};

export default preview;
