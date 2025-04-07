import { createContext, useCallback, useContext, useState } from 'react';
import useSearchField from '@/components/textfield/SearchField.hooks.ts';
import {
    SearchFieldProps,
    SearchFieldSize,
    SearchFieldContainerProps,
} from '@/components/textfield/SearchField.types.ts';
import IconSearch from '@/assets/icSearch.svg?react';
import IconTextClear from '@/assets/icTextClear.svg?react';

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
    size = 'medium',
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

    const heightClass = size === 'medium' ? 'h-[40px]' : 'h-[54px]';
    const gridTemplate = isFocused && value ? 'grid-cols-[24px_1fr_24px]' : 'grid-cols-[24px_1fr]';

    return (
        <div
            style={{ width: width > 0 ? `${width}px` : '100%' }}
            className={`relative grid ${gridTemplate} border-grey-40 items-center justify-items-start gap-2 border px-[11px] py-[7px] ${heightClass} rounded ${
                isFocused
                    ? 'border-transparent ring-2 ring-blue-500'
                    : 'hover:border-transparent hover:ring-2 hover:ring-blue-500'
            }`}
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
            className="text-m18 placeholder-grey-40 w-full border-none p-0 outline-none focus:outline-none focus:ring-0"
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

    return (
        <button
            className={`h-6 w-6 cursor-pointer ${!(isFocused && value) && 'hidden'}`}
            onMouseDown={handleClearMouseDown}
            onClick={handleClear}
        >
            <IconTextClear />
        </button>
    );
};

const StyledIconSearch = () => {
    return (
        <div className="text-grey-50 h-6 w-6">
            <IconSearch className="h-full w-full object-contain" />
        </div>
    );
};
