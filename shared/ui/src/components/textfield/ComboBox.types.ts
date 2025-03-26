import { ReactNode } from 'react';
import { Size } from '@/types/common.ts';

export type TextFieldSize = Extract<Size, 'small' | 'middle' | 'large'>;
export type TextFieldLabelPosition = 'inner' | 'outer';

export interface ComboBoxProps {
    size: TextFieldSize;
    width?: number;
    placeholder?: string;
    label?: string;
    labelColor?: string;
    labelPosition?: TextFieldLabelPosition;
    value?: string;
    noResultMessage?: string;
    onChange?: (value: string) => void;
    onInputChange?: (value: string) => void;
    showAllOptionsOnFocus?: boolean;
    allowCustomValue?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    children?: ReactNode;
}

export interface ComboBoxFontStyleProps {
    $fontSize: number;
    $lineHeight: number;
}

export interface ComboBoxInputStyleProps extends ComboBoxFontStyleProps {
    $cursor: string;
}

export interface ComboBoxContainerStyleProps {
    $width: string;
}

export interface ComboBoxLabelProps {
    label: string;
    labelColor: string;
}

export interface ComboBoxLabelStyleProps extends ComboBoxFontStyleProps {
    $padding: number;
    $color: string;
}

export interface ComboBoxInputWrapperProps {
    children?: ReactNode;
}

export interface ComboBoxInputWrapperStyleProps {
    $height: number;
    $bgColor: string;
    $hoverBgDropdown: string;
    $hoverBorderColor: string;
}

export interface ComboBoxDropdownButtonProps {
    $width: number;
    $height: number;
    $borderWidth: number;
}

export interface ComboBoxDropdownArrowProps {
    $size: number;
    $isOpen: boolean;
}

export interface ComboBoxDropdownContainerProps {
    optionList: SelectOption[];
}

export interface ComboBoxDropdownContainerStyleProps {
    $isOpen: boolean;
}

export interface SelectOption {
    value: string;
    label: string;
}
