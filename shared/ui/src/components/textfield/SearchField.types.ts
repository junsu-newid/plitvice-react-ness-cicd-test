import { ReactNode } from 'react';
import { Size } from '@/types/common.ts';

export type SearchFieldSize = Extract<Size, 'medium' | 'large'>;

export interface SearchFieldProps {
    size?: SearchFieldSize;
    width?: number;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onDone?: (value: string) => void;
    children?: ReactNode;
}

export interface SearchFieldContainerProps {
    children?: ReactNode;
}

export interface SearchFieldContainerStyleProps {
    $width: string;
    $height: number;
    $gridTemplate: string;
}

export interface SearchFieldClearButtonStyleProps {
    $display: string;
}
