import { BoxComponentStyles, Size } from '@/types/common.ts';
import React, { useCallback } from 'react';
import useSearchField from '@/components/searchfield/hooks.ts';
import IconSearch from '@/assets/icSearch.svg?react';
import IconTextClear from '@/assets/icTextClear.svg?react';
import InputBox from '../inputbox/InputBox';

type SearchFieldSize = Extract<Size, 'medium' | 'large'>;

export interface SearchFieldProps {
    size?: SearchFieldSize;
    width?: number;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onDone?: (value: string) => void;
}

const SearchField = ({
    size = 'medium',
    width = 0,
    placeholder = 'Search',
    value: initialValue = '',
    onChange = () => {},
    onDone = () => {},
}: SearchFieldProps) => {
    const { inputRef, isFocused, value, handleClear, handleChange } = useSearchField(initialValue, onChange, onDone);

    let sizeClass = '';
    switch (size) {
        case 'medium':
            sizeClass += ' py-[7px]';
            break;
        case 'large':
            sizeClass += ' py-[14px]';
            break;
    }

    const focusClass = isFocused
        ? 'border-transparent ring-2 ring-blue-500'
        : 'hover:border-transparent hover:ring-2 hover:ring-blue-500';

    const { height, inputText: textClass, iconSize: addonSizeClass } = BoxComponentStyles[size];

    const handleClearMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    }, []);

    return (
        <InputBox.Root
            className={`${sizeClass} border-grey-40 items-center justify-start gap-2 bg-white px-[11px] ${focusClass}`}
            width={width}
            height={height}
        >
            <InputBox.Prefix>
                <div className={`${addonSizeClass} text-grey-50`}>
                    <IconSearch className="h-full w-full object-contain" />
                </div>
            </InputBox.Prefix>
            <InputBox.Field
                className={`${textClass} focus:outline-none focus:ring-0`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                ref={inputRef}
            />
            <InputBox.Suffix className={`${addonSizeClass} ${!(isFocused && value) && 'hidden'}`}>
                <button onMouseDown={handleClearMouseDown} onClick={handleClear}>
                    <IconTextClear />
                </button>
            </InputBox.Suffix>
        </InputBox.Root>
    );
};
export { SearchField };
