import React, { JSX, ReactNode } from 'react';

// FIXME : - 공통 타입 경로 이동
export type CustomComponentProps<T extends keyof JSX.IntrinsicElements> = Omit<React.ComponentProps<T>, 'className'>;
export type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends CustomComponentProps<'button'> {
    size?: Extract<Size, 'sm' | 'md' | 'lg'>;
    variant?: 'fill' | 'stroke';
    children?: ReactNode;
}

export interface ButtonStyleProps {
    $enabledBG: string;
    $enabledColor: string;
    $enabledBorder: string;
    $hoverBG: string;
    $hoverColor: string;
    $hoverBorder: string;
    $focusedBG: string;
    $focusedColor: string;
    $focusedBorder: string;
    $pressedBG: string;
    $pressedColor: string;
    $pressedBorder: string;
    $fontSize: number;
    $height: number;
    $padding: number;
    $border: string;
}
