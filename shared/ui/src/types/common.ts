import React, { JSX } from 'react';

export type CustomComponentProps<T extends keyof JSX.IntrinsicElements> = Omit<React.ComponentProps<T>, 'className'>;

export type Size = 'small' | 'medium' | 'large';
export type LabelPosition = 'inner' | 'outer';

export const BoxComponentStyles: Record<
    Size,
    {
        height: number;
        heightClass: string;
        inputText: string;
        labelText: string;
        iconSize: string;
    }
> = {
    small: {
        height: 32,
        heightClass: 'h-[32px]',
        inputText: 'text-r14',
        labelText: 'text-m14',
        iconSize: 'size-[18px]',
    },
    medium: {
        height: 40,
        heightClass: 'h-[40px]',
        inputText: 'text-r16',
        labelText: 'text-m16',
        iconSize: 'size-[24px]',
    },
    large: {
        height: 54,
        heightClass: 'h-[54px]',
        inputText: 'text-r18',
        labelText: 'text-m18',
        iconSize: 'size-[24px]',
    },
};
