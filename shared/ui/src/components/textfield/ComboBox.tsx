import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme.ts';
import { CustomComponentProps, Size } from '@/types/common.ts';
import useComboBox from '@/components/textfield/ComboBox.hooks.ts';
import {
    ComboBoxProps,
    ComboBoxContainerStyledProps,
    ComboBoxLabelProps,
    TextFieldSize,
    ComboBoxDropdownContainerProps,
    ComboBoxFontStyleProps,
    ComboBoxLabelStyleProps,
    ComboBoxDropdownButtonProps,
    ComboBoxDropdownArrowProps,
    ComboBoxDropdownContainerStyleProps,
    ComboBoxInputWrapperProps,
    ComboBoxInputWrapperStyleProps,
    ComboBoxInputStyleProps,
} from '@/components/textfield/ComboBox.types.ts';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';

const ComboBoxSizeStyles: Record<
    Size,
    {
        height: number;
        inputFontSize: number;
        inputLineHeight: number;
        labelFontSize: number;
        labelLineHeight: number;
        arrowArea: number;
        arrowSize: number;
    }
> = {
    small: {
        height: 30,
        inputFontSize: 14,
        inputLineHeight: 18,
        labelFontSize: 12,
        labelLineHeight: 14,
        arrowArea: 32,
        arrowSize: 18,
    },
    middle: {
        height: 38,
        inputFontSize: 18,
        inputLineHeight: 24,
        labelFontSize: 16,
        labelLineHeight: 19,
        arrowArea: 38,
        arrowSize: 24,
    },
    large: {
        height: 52,
        inputFontSize: 18,
        inputLineHeight: 24,
        labelFontSize: 16,
        labelLineHeight: 19,
        arrowArea: 42,
        arrowSize: 24,
    },
};

export type ComboBoxContextType = ReturnType<typeof useComboBox> & {
    size: TextFieldSize;
    width?: number;
    placeholder?: string;
    noResultMessage?: string;
    readonly: boolean;
    disabled: boolean;
    invalid?: boolean;
};

const ComboBoxContext = React.createContext<ComboBoxContextType | undefined>(undefined);
const useComboBoxContext = () => {
    const context = useContext(ComboBoxContext);
    if (context === undefined) {
        throw new Error('useComboBox must be used within a ComboBox provider');
    }
    return context;
};

const ComboBox = ({
    size = 'small',
    width = 0,
    placeholder = 'Placeholder',
    label = '',
    labelColor = '',
    labelPosition = 'outer',
    value = '',
    noResultMessage = 'No results found',
    onChange = () => {},
    onInputChange = () => {},
    showAllOptionsOnFocus = true,
    allowCustomValue = true,
    readonly = false,
    disabled = false,
    invalid = false,
    children,
}: ComboBoxProps) => {
    const state = useComboBox(value, onChange, onInputChange, showAllOptionsOnFocus, allowCustomValue);
    const containerStyledProps: ComboBoxContainerStyledProps = {
        $width: width > 0 ? `${width}px` : '100%',
    };

    return (
        <ComboBoxContext.Provider
            value={{
                ...state,
                size,
                width,
                placeholder,
                noResultMessage,
                readonly,
                disabled,
                invalid,
            }}
        >
            <StyledContainer ref={state.containerRef} {...containerStyledProps}>
                {labelPosition === 'outer' && label !== '' ? (
                    <OuterLabel label={label} labelColor={labelColor} />
                ) : (
                    <></>
                )}
                <InputWrapper>
                    <StyledInputBox>
                        {labelPosition === 'inner' && label !== '' ? (
                            <InnerLabel label={label} labelColor={labelColor} />
                        ) : (
                            <></>
                        )}
                        <Input />
                    </StyledInputBox>
                    {children ? <DropdownButton /> : null}
                </InputWrapper>
                {children}
            </StyledContainer>
        </ComboBoxContext.Provider>
    );
};

const InputWrapper = ({ children }: ComboBoxInputWrapperProps) => {
    const { size, disabled, readonly } = useComboBoxContext();
    const styleProps: ComboBoxInputWrapperStyleProps = {
        $height: ComboBoxSizeStyles[size].height,
        $bgColor: theme.colors.white,
        $hoverBgDropdown: disabled || readonly ? theme.colors.transparent : theme.colors.blue100,
        $hoverBorderColor: disabled ? theme.colors.grey40 : theme.colors.blue500,
    };

    if (disabled) {
        styleProps.$bgColor = theme.colors.grey20;
    }

    return <StyledInputWrapper {...styleProps}>{children}</StyledInputWrapper>;
};

const OuterLabel = ({ ...props }: ComboBoxLabelProps) => {
    const { size } = useComboBoxContext();
    const styleProps: ComboBoxLabelStyleProps = {
        $padding: 4,
        $fontSize: ComboBoxSizeStyles[size].labelFontSize,
        $lineHeight: ComboBoxSizeStyles[size].labelLineHeight,
        $color: props.labelColor || theme.colors.grey70,
    };

    return (
        <StyledLabel className={'non-draggable'} {...styleProps}>
            {props.label}
        </StyledLabel>
    );
};

const InnerLabel = ({ ...props }: ComboBoxLabelProps) => {
    const styleProps: ComboBoxLabelStyleProps = {
        $padding: 0,
        $fontSize: 12,
        $lineHeight: 14,
        $color: props.labelColor || theme.colors.grey50,
    };
    return (
        <StyledLabel className={'non-draggable'} {...styleProps}>
            {props.label}
        </StyledLabel>
    );
};

const Input = () => {
    const {
        size,
        placeholder,
        readonly,
        disabled,
        inputRef,
        inputValue,
        handleInputChange,
        handleInputFocus,
        handleKeyDown,
    } = useComboBoxContext();
    const styleProps: ComboBoxInputStyleProps = {
        $fontSize: ComboBoxSizeStyles[size].inputFontSize,
        $lineHeight: ComboBoxSizeStyles[size].inputLineHeight,
        $cursor: readonly ? 'pointer' : 'text',
    };

    return (
        <StyledInput
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            {...styleProps}
        />
    );
};

const DropdownButton = ({ ref }: CustomComponentProps<'button'>) => {
    const { size, isFocused, readonly, toggleDropdown } = useComboBoxContext();
    const containerStyleProps: ComboBoxDropdownButtonProps = {
        $width: ComboBoxSizeStyles[size].arrowArea,
        $height: ComboBoxSizeStyles[size].height,
        $borderWidth: readonly ? 0 : 1,
    };
    const arrowStyleProps: ComboBoxDropdownArrowProps = {
        $size: ComboBoxSizeStyles[size].arrowSize,
        $isOpen: isFocused,
    };

    return (
        <StyledDropdownButton onClick={toggleDropdown} ref={ref} {...containerStyleProps}>
            <StyledDropdownArrow {...arrowStyleProps} />
        </StyledDropdownButton>
    );
};

const DropdownList = ({ optionList }: ComboBoxDropdownContainerProps) => {
    const { size, isFocused, setOptionList, filteredOptionList, handleOptionClick, noResultMessage } =
        useComboBoxContext();
    const containerStyleProps: ComboBoxDropdownContainerStyleProps = {
        $isOpen: isFocused,
    };
    const optionStyleProps: ComboBoxFontStyleProps = {
        $fontSize: ComboBoxSizeStyles[size].inputFontSize,
        $lineHeight: ComboBoxSizeStyles[size].height,
    };

    useEffect(() => {
        setOptionList(optionList);
    }, [optionList, setOptionList]);

    return (
        <StyledOptionsContainer
            className={'non-draggable'}
            role={'listbox'}
            aria-multiselectable={false}
            {...containerStyleProps}
        >
            {filteredOptionList.length > 0 ? (
                filteredOptionList.map((option) => (
                    <StyledOption
                        key={option.value}
                        onClick={() => handleOptionClick(option)}
                        role={'option'}
                        {...optionStyleProps}
                    >
                        {option.label}
                    </StyledOption>
                ))
            ) : (
                <StyledNoOptions {...optionStyleProps}>{noResultMessage}</StyledNoOptions>
            )}
        </StyledOptionsContainer>
    );
};

ComboBox.List = DropdownList;
export { ComboBox };

const StyledContainer = styled.div<{ $width: string }>`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 0;
    width: ${(props) => props.$width};
    height: fit-content;
`;

const StyledInputWrapper = styled.div<ComboBoxInputWrapperStyleProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    width: 100%;
    height: ${(props) => props.$height}px;
    background-color: ${(props) => props.$bgColor};
    border: 1px solid ${theme.colors.grey40};
    border-color: ${theme.colors.grey40};
    border-radius: 4px;
    transition: all 0.1s ease;

    button:nth-child(2) {
        border-color: ${theme.colors.grey40};
    }

    &:hover,
    &:focus-within {
        border-color: ${(props) => props.$hoverBorderColor};
        button:nth-child(2) {
            border-color: ${(props) => props.$hoverBorderColor};
        }
    }
    &:hover {
        button:nth-child(2) {
            background-color: ${(props) => props.$hoverBgDropdown};
        }
    }
`;

const StyledInputBox = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    height: 100%;
    padding: 0 12px;
`;

const StyledLabel = styled.label<ComboBoxLabelStyleProps>`
    padding-left: ${(props) => props.$padding}px;
    height: ${(props) => props.$lineHeight}px;
    font-weight: ${theme.fonts.weight.medium};
    font-size: ${(props) => props.$fontSize}px;
    line-height: ${(props) => props.$lineHeight}px;
    color: ${(props) => props.$color};
`;

const StyledInput = styled.input<ComboBoxInputStyleProps>`
    width: 100%;
    height: 24px;
    font-family: inherit;
    font-size: ${(props) => props.$fontSize}px;
    font-weight: 400;
    line-height: ${(props) => props.$lineHeight}px;
    color: ${theme.colors.grey90};
    cursor: ${(props) => props.$cursor};

    &::placeholder {
        color: ${theme.colors.grey40};
    }
`;

const StyledDropdownButton = styled.button<ComboBoxDropdownButtonProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.$width}px;
    height: ${(props) => props.$height - 2}px;
    border-left: ${(props) => props.$borderWidth}px solid ${theme.colors.grey50};
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    cursor: pointer;
    transition: all 0.1s ease;
`;

const StyledDropdownArrow = styled(DropdownIcon)<ComboBoxDropdownArrowProps>`
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
    transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.1s ease;
`;

const StyledOptionsContainer = styled.ul<ComboBoxDropdownContainerStyleProps>`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    padding: 6px 0;
    background-color: white;
    border: 1px solid ${theme.colors.grey20};
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
`;

const StyledOption = styled.li<ComboBoxFontStyleProps>`
    padding: 0 12px;
    width: 100%;
    font-size: ${(props) => props.$fontSize}px;
    line-height: ${(props) => props.$lineHeight}px;
    cursor: pointer;
    transition: background-color 0.1s ease;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:hover {
        background-color: ${theme.colors.grey10};
    }
`;

const StyledNoOptions = styled.li<ComboBoxFontStyleProps>`
    padding: 0 12px;
    font-size: ${(props) => props.$fontSize}px;
    line-height: ${(props) => props.$lineHeight}px;
    color: ${theme.colors.grey40};
    font-style: italic;
`;
