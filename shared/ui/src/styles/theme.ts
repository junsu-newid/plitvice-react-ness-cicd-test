import { DefaultTheme } from 'styled-components';

const colors = {
    // main
    primary: '#0571F7',
    secondary: '#2F89F8',

    // transparent
    transparent: '#FFFFFF00',

    // white
    white: '#FFFFFF',

    // grey
    grey5: '#FAFAFA',
    grey10: '#F2F2F2',
    grey20: '#E5E5E6',
    grey25: '#D5D6D7',
    grey30: '#CBCBCD',
    grey40: '#ADADAE',
    grey50: '#8E8E90',
    grey60: '#707071',
    grey70: '#515152',
    grey80: '#2D2D2E',
    grey90: '#1C1C1C',

    // black
    black: '#000000',

    // blue
    blue100: '#E6F1FE',
    blue200: '#C3DDFD',
    blue300: '#94C2FC',
    blue400: '#62A6FA',
    blue500: '#2F89F8', // secondary
    blue600: '#0571F7', // primary
    blue700: '#0460D2',
    blue800: '#0450AF',
    blue900: '#03408D',
    blue1000: '#02336F',
};

const fonts = {
    family: {
        pretendard: 'pretendard',
    },

    weight: {
        thin: 100,
        extraLight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extraBold: 800,
        black: 900,
    },

    size: {
        xs: '12px',
        small: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
    },
};

export const theme: DefaultTheme = {
    colors,
    fonts,
};

export type ColorTypes = typeof colors;
export type FontTypes = typeof fonts;
