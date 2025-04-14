import { BoxComponentStyles, Size } from '@/types/common.ts';
import useSelectBox from '@/components/selectbox/hooks.ts';
import DropdownList, { SelectOption } from '@/components/dropdownList';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';

type SelectBoxSize = Extract<Size, 'small' | 'medium'>;
const SizeStyles = {
    small: {
        pr: 'pr-[6px]',
    },
    medium: {
        pr: 'pr-[7px]',
    },
};

export interface SelectBoxProps {
    size?: SelectBoxSize;
    width?: number;
    placeholder?: string;
    label?: string;
    labelColor?: string;
    value?: SelectOption;
    optionList: SelectOption[];
    onChange?: (selected: SelectOption) => void;
    disabled?: boolean;
}

const SelectBox = ({
    size = 'small',
    width = 0,
    placeholder = 'Placeholder',
    label = '',
    labelColor = '',
    value = undefined,
    optionList,
    onChange = undefined,
    disabled = false,
}: SelectBoxProps) => {
    const { isFocused, selectedItem, containerRef, toggleDropdown, handleSelected } = useSelectBox(value, onChange);
    const { labelText, inputText, heightClass, iconSize } = BoxComponentStyles[size];
    const containerWidth = { width: width > 0 ? `${width}px` : '100%' };
    const labelTextColor = { color: labelColor || 'var(--color-grey-70)' };
    const fieldColor = disabled ? 'bg-grey-20' : 'bg-white hover:bg-blue-100 hover:border-blue-500';
    const fieldBorderColor = isFocused ? 'border-blue-500' : 'border-grey-40';
    const hoverBgColor = disabled ? '' : 'hover:bg-blue-100';
    const rotation = isFocused ? 'rotate-180' : 'rotate-0';
    const cursor = disabled ? '' : 'cursor-pointer';

    return (
        <div
            className={`relative flex h-fit flex-col items-start gap-[4px] p-0`}
            style={containerWidth}
            ref={containerRef}
        >
            {label !== '' ? (
                <label className={`pl-[4px] ${labelText} non-draggable`} style={labelTextColor}>
                    {label}
                </label>
            ) : null}
            <div
                className={`flex w-full ${heightClass} flex items-center gap-[4px] pl-[11px] ${SizeStyles[size].pr} ${fieldColor} ${fieldBorderColor} rounded-[4px] border-[1px] ${hoverBgColor} ${cursor}`}
                onClick={disabled ? undefined : toggleDropdown}
            >
                <input
                    value={selectedItem?.label || ''}
                    placeholder={placeholder}
                    readOnly={true}
                    disabled={disabled}
                    className={`h-full w-full cursor-pointer ${inputText}`}
                />
                <div className={`${iconSize}`}>
                    <DropdownIcon
                        className={`${iconSize} ${rotation} text-grey-50 transition-transform duration-100`}
                    />
                </div>
            </div>
            <DropdownList size={size} isFocused={isFocused} optionList={optionList} onSelected={handleSelected} />
        </div>
    );
};
export default SelectBox;
