import { createGlobalStyle } from 'styled-components';
import { reset } from '@/styles/reset';

export const GlobalStyle = createGlobalStyle`
    ${reset}

    body {
        ${({ theme }) => `
            font-family: ${theme.fonts.family.pretendard};
            font-weight: ${theme.fonts.weight.normal};
            font-size: ${theme.fonts.size.md};
            line-height: 1.125rem;
        `}
    }

    @font-face {
        font-family: 'pretendard';
        font-style: normal;
        font-weight: normal;
        src: url('https://paro-cdn.its-newid.net/font/pretendard_regular_subset.woff2') format('woff2');
    }
    @font-face {
        font-family: 'pretendard';
        font-style: normal;
        font-weight: bold;
        src: url('https://paro-cdn.its-newid.net/font/pretendard_bold_subset.woff2') format('woff2');
    }
    
    .non-draggable {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
`;
