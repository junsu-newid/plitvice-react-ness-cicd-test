import React from 'react';

export interface TextAreaProps {
    width?: number;
    height?: number;
    value?: string;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
    ref?: React.Ref<HTMLTextAreaElement>;
}
