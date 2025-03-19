import { CustomComponentProps, Size } from '@/component/button/type.ts';
import { ReactNode } from 'react';

export type TextFieldSize = Extract<Size, 'sm' | 'lg'>;

export interface BaseTextFieldProps {
    size: TextFieldSize;
    disabled: boolean;
    invalid?: boolean;
}

export interface TextFieldProps extends Partial<BaseTextFieldProps> {
    children?: ReactNode;
}

export interface TextFieldStyleProps {
    $height: number;
    $padding: number;
    $gap: number;
    $border: string;
    $enabledBG: string;
    $enabledBorder: string;
    $focusedBorder: string;
}

export interface TextFieldInputBoxStyleProps {
    $padding: number;
}

export interface TextFieldLabelProps extends CustomComponentProps<'label'> {
    children: ReactNode;
}

export interface TextFieldLabelStyleProps {
    $fontSize: number;
    $lineHeight: number;
    $color: string;
}

export type TextFieldInputProps = CustomComponentProps<'input'>;

export interface TextFieldInputStyledProps {
    $fontSize: number;
    $lineHeight: number;
    $enabledColor: string;
    $focusedColor: string;
    $placeholderColor: string;
}

export interface TextFieldIconProps extends CustomComponentProps<'div'> {
    children: ReactNode;
}

export interface TextFieldIconStyledProps {
    $size: number;
}
