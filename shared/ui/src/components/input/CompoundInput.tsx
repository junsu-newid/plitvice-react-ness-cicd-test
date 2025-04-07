import React, { forwardRef, ReactNode } from 'react';
import useTextField from '@/components/input/hooks.ts';

// FIXME : - 2. 조합 버전(합성컴포넌트)
// FIXME : - LeftIcon, RightButton 등 Input 양옆에 배치될 있는 레이아웃 지정 필요
// FIXME : - div로 감싸 relative 지정 후 LeftIcon, RightButton를 absolute로 양 옆 배치할지
// FIXME : - 이미지 어떻게 넘겨받을지(svg 또는 png 타입일수도), 아이콘이지만 onClick 가능할수도
// FIXME : - 아니먄 Props로 넘겨받을지
// FIXME : - 글자수 표시, Message등을 우측에 넣을 수도 있음, 버튼 등
// FIXME : - iconRender : () => ReactNode renderProp pattern 방식으로 갈지 - 상태에 따라 달라져야할때
// FIXME : - prefix,suffix

export interface TextFieldRootProps {
    children: ReactNode;
    className?: string;
}

export interface TextFieldInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onInputChange?: (value: string) => void;
    onEnter?: (value: string) => void;
    resetOnEscape?: boolean;
    updateOnBlur?: boolean;
    className?: string;
}

export interface TextFieldIconProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

interface TextFieldComposition {
    Root: React.FC<TextFieldRootProps>;
    Input: React.ForwardRefExoticComponent<TextFieldInputProps & React.RefAttributes<HTMLInputElement>>;
    LeftIcon: React.FC<TextFieldIconProps>;
    RightIcon: React.FC<TextFieldIconProps>;
}

const TextFieldRoot: React.FC<TextFieldRootProps> = ({ children, className = '' }) => {
    return <div className={`relative flex items-center ${className}`}>{children}</div>;
};

const TextFieldField = forwardRef<HTMLInputElement, TextFieldInputProps>(
    (
        {
            value: externalValue,
            defaultValue,
            onChange,
            onInputChange,
            onEnter,
            resetOnEscape,
            updateOnBlur,
            className = '',
            ...props
        },
        ref,
    ) => {
        const { isFocused, inputRef, handleInputFocus, handleKeyDown, value, handleChange } = useTextField({
            initialValue: externalValue || defaultValue,
            onChange,
            onInputChange,
            onEnter,
            resetOnEscape,
            updateOnBlur,
        });

        const combinedRef = (node: HTMLInputElement) => {
            inputRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        return (
            <input
                ref={combinedRef}
                className={`w-full rounded border px-3 py-2 outline-none transition-all ${isFocused ? 'border-blue-500 shadow-sm' : 'border-gray-300'} ${className}`}
                value={value}
                onChange={handleChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                {...props}
            />
        );
    },
);

TextFieldField.displayName = 'TextFieldField';

const TextFieldLeftIcon: React.FC<TextFieldIconProps> = ({ children, onClick, className = '' }) => {
    return (
        <div
            className={`absolute left-3 flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

const TextFieldRightIcon: React.FC<TextFieldIconProps> = ({ children, onClick, className = '' }) => {
    return (
        <div
            className={`absolute right-3 flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

const TextFieldInput = {
    Root: TextFieldRoot,
    Input: TextFieldField,
    LeftIcon: TextFieldLeftIcon,
    RightIcon: TextFieldRightIcon,
} as TextFieldComposition;

export default TextFieldInput;
