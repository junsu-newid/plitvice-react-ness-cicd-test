import React, { JSX } from 'react';

export type CustomComponentProps<T extends keyof JSX.IntrinsicElements> = Omit<React.ComponentProps<T>, 'className'>;
export type Size = 'small' | 'middle' | 'large';
