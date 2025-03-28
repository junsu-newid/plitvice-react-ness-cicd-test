import React, { useContext, useEffect } from 'react';
import { CustomComponentProps } from '@/types/common.ts';
import useComboBox from '@/components/textfield/ComboBox.hooks.ts';
import {
    ComboBoxProps,
    ComboBoxLabelProps,
    TextFieldSize,
    ComboBoxDropdownContainerProps,
    ComboBoxInputWrapperProps,
} from '@/components/textfield/ComboBox.types.ts';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';

const ComboBoxSizeStyles = {
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
    const containerWidth = width > 0 ? `w-[${width}px]` : 'w-full';

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
            <div
                ref={state.containerRef}
                className={`relative flex flex-col items-start gap-1 p-0 ${containerWidth} h-fit`}
            >
                {labelPosition === 'outer' && label !== '' ? (
                    <OuterLabel label={label} labelColor={labelColor} />
                ) : null}
                <InputWrapper>
                    <div className="flex h-full flex-1 flex-col justify-center px-3">
                        {labelPosition === 'inner' && label !== '' ? (
                            <InnerLabel label={label} labelColor={labelColor} />
                        ) : null}
                        <Input />
                    </div>
                    {children ? <DropdownButton /> : null}
                </InputWrapper>
                {children}
            </div>
        </ComboBoxContext.Provider>
    );
};

const InputWrapper = ({ children }: ComboBoxInputWrapperProps) => {
    const { size, disabled } = useComboBoxContext();
    const height = `h-[${ComboBoxSizeStyles[size].height}px]`;

    const bgColor = disabled ? 'bg-gray-200' : 'bg-white';
    const hoverBorderColor = disabled ? 'border-gray-400' : 'hover:border-blue-500 focus-within:border-blue-500';
    // const hoverBgDropdown = disabled || readonly ? '' : 'hover:bg-blue-100';

    return (
        <div
            className={`flex w-full flex-row items-center p-0 ${height} ${bgColor} rounded border border-gray-400 transition-all duration-100 ${hoverBorderColor} group`}
        >
            {children}
        </div>
    );
};

const OuterLabel = ({ label, labelColor }: ComboBoxLabelProps) => {
    const { size } = useComboBoxContext();
    const fontSize = `text-[${ComboBoxSizeStyles[size].labelFontSize}px]`;
    const lineHeight = `leading-[${ComboBoxSizeStyles[size].labelLineHeight}px]`;
    const textColor = labelColor ? `text-[${labelColor}]` : 'text-gray-600';

    return <label className={`pl-1 font-medium ${fontSize} ${lineHeight} ${textColor} non-draggable`}>{label}</label>;
};

const InnerLabel = ({ label, labelColor }: ComboBoxLabelProps) => {
    const textColor = labelColor ? `text-[${labelColor}]` : 'text-gray-500';

    return <label className={`p-0 text-xs font-medium leading-[14px] ${textColor} non-draggable`}>{label}</label>;
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

    const fontSize = `text-[${ComboBoxSizeStyles[size].inputFontSize}px]`;
    const lineHeight = `leading-[${ComboBoxSizeStyles[size].inputLineHeight}px]`;
    const cursor = readonly ? 'cursor-pointer' : 'cursor-text';

    return (
        <input
            className={`h-6 w-full font-normal ${fontSize} ${lineHeight} text-gray-800 ${cursor} placeholder-gray-400`}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
        />
    );
};

const DropdownButton = ({ ref }: CustomComponentProps<'button'>) => {
    const { size, isFocused, readonly, toggleDropdown } = useComboBoxContext();

    const width = `w-[${ComboBoxSizeStyles[size].arrowArea}px]`;
    const height = `h-[${ComboBoxSizeStyles[size].height - 2}px]`;
    const borderWidth = readonly ? 'border-l-0' : 'border-l border-gray-500';
    const iconSize = `w-[${ComboBoxSizeStyles[size].arrowSize}px] h-[${ComboBoxSizeStyles[size].arrowSize}px]`;
    const rotation = isFocused ? 'rotate-180' : 'rotate-0';

    return (
        <button
            onClick={toggleDropdown}
            ref={ref}
            className={`flex items-center justify-center ${width} ${height} ${borderWidth} cursor-pointer rounded-r transition-all duration-100 group-hover:border-blue-500`}
        >
            <DropdownIcon className={`${iconSize} ${rotation} transition-transform duration-100`} />
        </button>
    );
};

const DropdownList = ({ optionList }: ComboBoxDropdownContainerProps) => {
    const { size, isFocused, setOptionList, filteredOptionList, handleOptionClick, noResultMessage } =
        useComboBoxContext();

    const display = isFocused ? 'block' : 'hidden';
    const fontSize = `text-[${ComboBoxSizeStyles[size].inputFontSize}px]`;
    const lineHeight = `leading-[${ComboBoxSizeStyles[size].height}px]`;

    useEffect(() => {
        setOptionList(optionList);
    }, [optionList, setOptionList]);

    return (
        <ul
            className={`absolute left-0 right-0 top-[calc(100%+4px)] z-10 max-h-[200px] overflow-y-auto rounded border border-gray-200 bg-white px-0 py-1.5 shadow-md ${display} non-draggable`}
            role="listbox"
            aria-multiselectable="false"
        >
            {filteredOptionList.length > 0 ? (
                filteredOptionList.map((option) => (
                    <li
                        key={option.value}
                        onClick={() => handleOptionClick(option)}
                        role="option"
                        className={`w-full px-3 ${fontSize} ${lineHeight} cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-100 hover:bg-gray-100`}
                    >
                        {option.label}
                    </li>
                ))
            ) : (
                <li className={`px-3 ${fontSize} ${lineHeight} italic text-gray-400`}>{noResultMessage}</li>
            )}
        </ul>
    );
};

ComboBox.List = DropdownList;
export { ComboBox };
