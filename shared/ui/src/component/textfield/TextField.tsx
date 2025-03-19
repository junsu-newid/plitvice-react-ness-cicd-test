import styled from 'styled-components';
import { theme } from '@/style/theme.ts';
import {
    TextFieldIconProps,
    TextFieldInputProps,
    TextFieldLabelProps,
    TextFieldProps,
    TextFieldSize,
    TextFieldStyleProps,
    TextFieldInputBoxStyleProps,
    TextFieldLabelStyleProps,
    TextFieldInputStyledProps,
    TextFieldIconStyledProps,
    BaseTextFieldProps,
} from '@/component/textfield/type.ts';
import React, { ReactNode, useContext } from 'react';

const TextFieldSizeStyles: Record<
    TextFieldSize,
    { height: number; fontSize: number; lineHeight: number; iconSize: number }
> = {
    sm: { height: 32, fontSize: 14, lineHeight: 18, iconSize: 18 },
    lg: { height: 54, fontSize: 16, lineHeight: 24, iconSize: 24 },
};

export const TextFieldContext = React.createContext<BaseTextFieldProps>({
    size: 'sm',
    disabled: false,
    invalid: false,
});

const TextField = ({ children, size = 'sm', disabled = false, invalid = false }: TextFieldProps) => {
    const styleProps: TextFieldStyleProps = {
        $height: TextFieldSizeStyles[size].height,
        $padding: 12,
        $gap: 4,
        $border: '1px solid',
        $enabledBG: theme.colors.white,
        $enabledBorder: theme.colors.grey40,
        $focusedBorder: theme.colors.primary,
    };

    if (disabled) {
        styleProps.$enabledBG = theme.colors.grey20;
    }

    return (
        <TextFieldContext.Provider value={{ size, disabled, invalid }}>
            <StyledWrapper {...styleProps}>{children}</StyledWrapper>
        </TextFieldContext.Provider>
    );
};

const InputBox = ({ children }: { children: ReactNode }) => {
    const styleProps: TextFieldInputBoxStyleProps = {
        $padding: 4,
    };

    return <StyledInputBox {...styleProps}>{children}</StyledInputBox>;
};

const Label = ({ children, ...props }: TextFieldLabelProps) => {
    const { size } = useContext(TextFieldContext);
    if (size === 'sm') return null;

    const styleProps: TextFieldLabelStyleProps = {
        $fontSize: 12,
        $lineHeight: 17,
        $color: theme.colors.grey50,
    };

    return (
        <StyledLabel {...props} {...styleProps}>
            {children}
        </StyledLabel>
    );
};

const Input = ({ ref, ...props }: TextFieldInputProps) => {
    const { size, disabled } = useContext(TextFieldContext);

    const styleProps: TextFieldInputStyledProps = {
        $fontSize: TextFieldSizeStyles[size].fontSize,
        $lineHeight: TextFieldSizeStyles[size].lineHeight,
        $enabledColor: theme.colors.grey40,
        $focusedColor: theme.colors.grey90,
        $placeholderColor: theme.colors.grey40,
    };

    return <StyledInput disabled={disabled} {...props} {...styleProps} ref={ref} />;
};

const Icon = ({ children, ...props }: TextFieldIconProps) => {
    const { size } = useContext(TextFieldContext);

    const styleProps: TextFieldIconStyledProps = {
        $size: TextFieldSizeStyles[size].iconSize,
    };

    return (
        <StyledIconWrapper {...props} {...styleProps}>
            {children}
        </StyledIconWrapper>
    );
};

TextField.InputBox = InputBox;
TextField.Input = Input;
TextField.Label = Label;
TextField.Icon = Icon;
export { TextField };

const StyledWrapper = styled.div<TextFieldStyleProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: ${(props) => props.$height}px;
    padding: 0 ${(props) => props.$padding}px;
    gap: ${(props) => props.$gap}px;
    background-color: ${(props) => props.$enabledBG};
    border: ${(props) => props.$border};
    border-color: ${(props) => props.$enabledBorder};
    border-radius: 4px;

    &:focus-within {
        border-color: ${(props) => props.$focusedBorder};
    }
`;

const StyledInputBox = styled.div<TextFieldInputBoxStyleProps>`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    padding: ${(props) => props.$padding}px 0;
`;

const StyledLabel = styled.label<TextFieldLabelStyleProps>`
    font-weight: ${theme.fonts.weight.medium};
    font-size: ${(props) => props.$fontSize}px;
    line-height: ${(props) => props.$lineHeight}px;
    color: ${(props) => props.$color};
`;

const StyledInput = styled.input<TextFieldInputStyledProps>`
    flex: 1;
    font-family: inherit;
    font-weight: ${theme.fonts.weight.normal};
    font-size: ${(props) => props.$fontSize}px;
    line-height: ${(props) => props.$lineHeight}px;
    color: ${(props) => props.$focusedColor};

    &::placeholder {
        color: ${(props) => props.$placeholderColor};
    }
`;

const StyledIconWrapper = styled.div<TextFieldIconStyledProps>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;

    & > svg,
    & > img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
`;
