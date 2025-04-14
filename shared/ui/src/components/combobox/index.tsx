import { BoxComponentStyles, LabelPosition, Size } from '@/types/common.ts';
import { SelectBoxProps } from '@/components/selectbox';
import useComboBox from '@/components/combobox/hooks.ts';
import DropdownList, { SelectOption } from '@/components/dropdownList';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';

type ComboBoxSize = Extract<Size, 'medium' | 'large'>;

export interface ComboBoxProps extends Omit<SelectBoxProps, 'size'> {
    size: ComboBoxSize;
    noResultMessage?: string;
    labelPosition?: LabelPosition;
    optionList: SelectOption[];
    onInputChange?: (value: string) => void;
    showAllOptionsOnFocus?: boolean;
    allowCustomValue?: boolean;
    readOnly?: boolean;
}

const ComboBox = ({
    size = 'medium',
    width = 0,
    placeholder = 'Placeholder',
    noResultMessage = 'No results found',
    label = '',
    labelColor = '',
    labelPosition = 'outer',
    value = undefined,
    optionList,
    onChange = () => {},
    onInputChange = () => {},
    showAllOptionsOnFocus = true,
    allowCustomValue = true,
    readOnly = false,
    disabled = false,
}: ComboBoxProps) => {
    const {
        isFocused,
        inputValue,
        filteredList,
        containerRef,
        inputRef,
        handleInputChange,
        handleInputFocus,
        toggleDropdown,
        handleSelected,
        handleKeyDown,
    } = useComboBox(
        value || ({ value: '', label: '' } as SelectOption),
        optionList,
        onChange,
        onInputChange,
        showAllOptionsOnFocus,
        allowCustomValue,
    );

    const containerWidth = { width: width > 0 ? `${width}px` : '100%' };
    const fieldColor = disabled ? 'bg-grey-20' : 'bg-white hover:bg-blue-100 hover:border-blue-500 group';
    const fieldBorderColor = isFocused ? 'border-blue-500' : 'border-grey-40';
    const inputBgColor = disabled ? 'bg-transparent' : 'bg-white';
    const labelTextColor = {
        color: labelColor || (labelPosition === 'outer' ? 'var(--color-grey-70)' : 'var(--color-grey-50)'),
    };
    const buttonBorderColor = isFocused ? 'border-blue-500' : 'border-grey-40';
    const iconRotation = isFocused ? 'rotate-180' : 'rotate-0';

    const { labelText, inputText, heightClass, iconSize } = BoxComponentStyles[size];

    return (
        <div
            ref={containerRef}
            className={`relative flex h-fit flex-col items-start gap-[4px] p-0`}
            style={containerWidth}
        >
            {labelPosition === 'outer' && label !== '' ? (
                <label className={`pl-[4px] ${labelText} non-draggable`} style={labelTextColor}>
                    {label}
                </label>
            ) : null}
            <div
                className={`flex w-full ${heightClass} ${fieldColor} ${fieldBorderColor} items-center overflow-hidden rounded-[4px] border-[1px] p-0`}
            >
                <div className={`flex h-full flex-1 flex-col justify-center px-[11px] ${inputBgColor}`}>
                    {labelPosition === 'inner' && label !== '' && size === 'large' ? (
                        <label className={`text-m12 non-draggable p-0`} style={labelTextColor}>
                            {label}
                        </label>
                    ) : null}
                    <input
                        ref={inputRef}
                        value={inputValue}
                        placeholder={placeholder}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onKeyDown={handleKeyDown}
                        readOnly={readOnly}
                        disabled={disabled}
                        className={`placeholder:text-grey-40 ${inputText}`}
                    />
                </div>
                <button
                    onClick={toggleDropdown}
                    className={`flex h-full items-center justify-center rounded-r-[4px] border-l bg-transparent px-[9px] ${buttonBorderColor} group-hover:border-blue-500`}
                    disabled={disabled}
                >
                    <DropdownIcon className={`${iconSize} ${iconRotation} text-grey-50 transition-all duration-100`} />
                </button>
            </div>
            <DropdownList
                size={size}
                noResultMessage={noResultMessage}
                isFocused={isFocused}
                optionList={filteredList}
                onSelected={handleSelected}
            />
        </div>
    );
};

export default ComboBox;
