import { CustomComponentProps, Size } from '@/types/common.ts';
import React, { ReactNode } from 'react';

export interface ButtonProps extends CustomComponentProps<'button'> {
    size?: Extract<Size, 'small' | 'middle' | 'large'>;
    variant?: 'default' | 'normal' | 'alert';
    fill?: boolean;
    children?: ReactNode;
    ref?: React.Ref<HTMLButtonElement>;
}
