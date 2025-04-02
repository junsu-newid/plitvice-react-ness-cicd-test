import React, { Children, isValidElement, useContext, useEffect } from 'react';
import { CustomComponentProps } from '@/types/common.ts';
import useComboBox from '@/components/textfield/ComboBox.hooks.ts';
import {
    ComboBoxProps,
    ComboBoxLabelProps,
    TextFieldSize,
    ComboBoxDropdownContainerProps,
    ComboBoxInputWrapperProps,
    ComboBoxInputProps,
} from '@/components/textfield/ComboBox.types.ts';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';

const ComboBoxSizeStyles = {
    small: {
        height: 'h-[30px]',
        inputText: 'text-r14',
        outerLabelText: 'text-m14',
        arrowArea: 'w-[30px]',
        arrowSize: 'size-[18px]',
        inputPaddingX: 5,
        dropdownItemPaddingY: 'py-[7px]',
    },
    middle: {
        height: 'h-[38px]',
        inputText: 'text-r18',
        outerLabelText: 'text-m16',
        arrowArea: 'w-[38px]',
        arrowSize: 'size-[24px]',
        inputPaddingX: 6,
        dropdownItemPaddingY: 'py-[8px]',
    },
    large: {
        height: 'h-[52px]',
        inputText: 'text-r18',
        outerLabelText: 'text-m16',
        arrowArea: 'w-[42px]',
        arrowSize: 'size-[24px]',
        inputPaddingX: 13,
        dropdownItemPaddingY: 'py-[15px]',
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
    hasDropdownList: boolean;
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
    const hasList = hasDropdownList(children);
    const containerWidth = { width: width > 0 ? `${width}px` : '100%' };

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
                hasDropdownList: hasList,
            }}
        >
            <div
                ref={state.containerRef}
                className={`relative flex h-fit flex-col items-start gap-[4px] p-0`}
                style={containerWidth}
            >
                {labelPosition === 'outer' && label !== '' ? (
                    <OuterLabel label={label} labelColor={labelColor} />
                ) : null}
                <InputWrapper>
                    <div className="flex h-full flex-1 flex-col justify-center">
                        {labelPosition === 'inner' && label !== '' && size === 'large' ? (
                            <InnerLabel label={label} labelColor={labelColor} />
                        ) : null}
                        <Input isInnerLabel={labelPosition === 'inner' && label !== '' && size === 'large'} />
                    </div>
                    {hasList ? <DropdownButton /> : null}
                </InputWrapper>
                {children}
            </div>
        </ComboBoxContext.Provider>
    );
};

const InputWrapper = ({ children }: ComboBoxInputWrapperProps) => {
    const { size, disabled } = useComboBoxContext();
    const bgColor = disabled ? 'bg-grey-20' : 'bg-white';
    const hoverBgColor = disabled ? '' : 'hover:bg-blue-100';
    const hoverBorderColor = disabled ? 'border-grey-40' : 'hover:border-blue-500 focus-within:border-blue-500';
    const groupStyle = disabled ? '' : 'group';

    return (
        <div
            className={`flex w-full ${ComboBoxSizeStyles[size].height} flex-row items-center p-0 ${bgColor} border-grey-40 rounded-[4px] border-[1px] transition-all duration-100 ${hoverBgColor} ${hoverBorderColor} ${groupStyle} relative overflow-hidden`}
        >
            {children}
        </div>
    );
};

const OuterLabel = ({ label, labelColor }: ComboBoxLabelProps) => {
    const { size } = useComboBoxContext();
    const textSize = ComboBoxSizeStyles[size].outerLabelText;
    const textColor = labelColor ? `text-[${labelColor}]` : 'text-grey-70';

    return <label className={`pl-[4px] ${textSize} ${textColor} non-draggable`}>{label}</label>;
};

const InnerLabel = ({ label, labelColor }: ComboBoxLabelProps) => {
    const textColor = labelColor ? `text-[${labelColor}]` : 'text-grey-50';

    return <label className={`text-m14 p-0 ${textColor} non-draggable absolute left-[11px] top-[5px]`}>{label}</label>;
};

const Input = ({ isInnerLabel }: ComboBoxInputProps) => {
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
        hasDropdownList,
    } = useComboBoxContext();
    const textSize = ComboBoxSizeStyles[size].inputText;
    const isSelectBox = readonly && hasDropdownList;
    const cursorStyle = isSelectBox ? 'cursor-pointer' : disabled ? 'none' : 'cursor-text';
    const styles = {
        paddingTop: isInnerLabel ? '22px' : `${ComboBoxSizeStyles[size].inputPaddingX}px`,
        paddingBottom: isInnerLabel ? '4px' : `${ComboBoxSizeStyles[size].inputPaddingX}px`,
        backgroundColor: `var(${isSelectBox || disabled ? '--color-transparent' : '--color-white'})`,
    };

    return (
        <input
            className={`w-full px-[11px] ${textSize} text-grey-90 ${cursorStyle} placeholder-grey-40 rounded-l-[4px]`}
            style={styles}
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
    const { size, isFocused, disabled, readonly, toggleDropdown } = useComboBoxContext();
    const borderWidth = readonly ? 'border-l-0' : 'border-l';
    const borderColor = isFocused ? 'border-blue-500' : 'border-grey-40';
    const rotation = isFocused ? 'rotate-180' : 'rotate-0';

    return (
        <button
            onClick={toggleDropdown}
            ref={ref}
            className={`flex ${ComboBoxSizeStyles[size].arrowArea} h-full items-center justify-center ${borderWidth} rounded-r-[4px] ${borderColor} group-hover:border-blue-500`}
            disabled={disabled}
        >
            <DropdownIcon
                className={`${ComboBoxSizeStyles[size].arrowSize} ${rotation} text-grey-50 transition-transform duration-100`}
            />
        </button>
    );
};

const hasDropdownList = (children: React.ReactNode): boolean => {
    const childrenArray = Children.toArray(children);
    return childrenArray.some((child) => isValidElement(child) && child.type === DropdownList);
};

const DropdownList = ({ optionList }: ComboBoxDropdownContainerProps) => {
    const { size, isFocused, setOptionList, filteredOptionList, handleOptionClick, noResultMessage } =
        useComboBoxContext();

    const display = isFocused ? 'block' : 'hidden';
    const textStyle = ComboBoxSizeStyles[size].inputText;

    useEffect(() => {
        setOptionList(optionList);
    }, [optionList, setOptionList]);

    return (
        <ul
            className={`border-grey-20 absolute left-0 right-0 top-[calc(100%+4px)] z-10 max-h-[200px] overflow-y-auto rounded-[4px] border bg-white px-0 py-[6px] shadow-md ${display} non-draggable`}
            role="listbox"
            aria-multiselectable="false"
        >
            {filteredOptionList.length > 0 ? (
                filteredOptionList.map((option) => (
                    <li
                        key={option.value}
                        onClick={() => handleOptionClick(option)}
                        role="option"
                        className={`w-full px-[12px] ${ComboBoxSizeStyles[size].dropdownItemPaddingY} ${textStyle} cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-100 hover:bg-gray-100`}
                    >
                        {option.label}
                    </li>
                ))
            ) : (
                <li
                    className={`px-[12px] ${ComboBoxSizeStyles[size].dropdownItemPaddingY} ${textStyle} italic text-gray-400`}
                >
                    {noResultMessage}
                </li>
            )}
        </ul>
    );
};

ComboBox.List = DropdownList;
export { ComboBox };
