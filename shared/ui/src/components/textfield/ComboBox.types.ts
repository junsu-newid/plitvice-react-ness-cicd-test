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

export interface ComboBoxLabelProps {
    label: string;
    labelColor: string;
}

export interface ComboBoxInputWrapperProps {
    children?: ReactNode;
}

export interface ComboBoxInputProps {
    isInnerLabel: boolean;
}

export interface ComboBoxDropdownContainerProps {
    optionList: SelectOption[];
}

export interface SelectOption {
    value: string;
    label: string;
}
