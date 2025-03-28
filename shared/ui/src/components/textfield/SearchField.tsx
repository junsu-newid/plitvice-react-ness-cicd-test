import React, { createContext, useCallback, useContext, useState } from 'react';
import useSearchField from '@/components/textfield/SearchField.hooks.ts';
import {
    SearchFieldProps,
    SearchFieldSize,
    SearchFieldContainerProps,
} from '@/components/textfield/SearchField.types.ts';
import IconSearch from '@/assets/icSearch.svg?react';
import IconTextClear from '@/assets/icTextClear.svg?react';

const SearchFieldStyles = {
    middle: {
        height: 'h-[38px]',
    },
    large: {
        height: 'h-[52px]',
    },
};

export type SearchFieldContextType = ReturnType<typeof useSearchField> & {
    size: SearchFieldSize;
    width: number;
    placeholder?: string;
};
const SearchFieldContext = createContext<SearchFieldContextType | undefined>(undefined);
const useSearchFieldContext = () => {
    const context = useContext(SearchFieldContext);
    if (context === undefined) {
        throw new Error('useSearchField must be used within a SearchField provider');
    }
    return context;
};

export const SearchField = ({
    size = 'middle',
    width = 240,
    placeholder = 'Search',
    value = '',
    onChange = () => {},
    onDone = () => {},
}: SearchFieldProps) => {
    const state = useSearchField(value, onChange, onDone);

    return (
        <SearchFieldContext.Provider value={{ ...state, size, width, placeholder }}>
            <Container>
                <StyledIconSearch />
                <Input />
                <ClearButton />
            </Container>
        </SearchFieldContext.Provider>
    );
};

const Container = ({ children }: SearchFieldContainerProps) => {
    const { size, width, isFocused, value } = useSearchFieldContext();
    const widthClass = width > 0 ? `w-[${width}px]` : 'w-full';
    const heightClass = SearchFieldStyles[size].height;

    return (
        <div
            className={`relative flex items-center gap-2 px-[11px] ${widthClass} ${heightClass} rounded border border-gray-300 focus-within:border-blue-500 hover:border-blue-500`}
            style={{
                display: 'grid',
                gridTemplateColumns: isFocused && value ? '24px 1fr 24px' : '24px 1fr',
            }}
        >
            {children}
        </div>
    );
};

const Input = () => {
    const [composing, setComposing] = useState(false);
    const { placeholder, inputRef, value, handleChange, handleFocus, handleBlur, handleKeyDown } =
        useSearchFieldContext();

    return (
        <input
            className="w-full border-none p-0 text-lg leading-6 placeholder-gray-300"
            placeholder={placeholder}
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, composing)}
        />
    );
};

const ClearButton = () => {
    const { isFocused, value, handleClear } = useSearchFieldContext();
    const handleClearMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    }, []);

    if (!isFocused || !value) {
        return null;
    }

    return (
        <button className="h-6 w-6" onMouseDown={handleClearMouseDown} onClick={handleClear}>
            <IconTextClear />
        </button>
    );
};

const StyledIconSearch = () => <IconSearch className="h-6 w-6 text-gray-400" />;
