import React, { createContext, useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme.ts';
import useSearchField from '@/components/textfield/SearchField.hooks.ts';
import {
    SearchFieldProps,
    SearchFieldSize,
    SearchFieldContainerStyleProps,
    SearchFieldClearButtonStyleProps,
    SearchFieldContainerProps,
} from '@/components/textfield/SearchField.types.ts';
import IconSearch from '@/assets/icSearch.svg?react';
import IconTextClear from '@/assets/icTextClear.svg?react';

const SearchFieldStyles: Record<SearchFieldSize, { height: number }> = {
    middle: {
        height: 38,
    },
    large: {
        height: 52,
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
    const styleProps: SearchFieldContainerStyleProps = {
        $width: width > 0 ? `${width}px` : '100%',
        $height: SearchFieldStyles[size].height,
        $gridTemplate: isFocused && value ? '24px 1fr 24px' : '24px 1fr',
    };

    return <StyledContainer {...styleProps}>{children}</StyledContainer>;
};

const Input = () => {
    const [composing, setComposing] = useState(false);
    const { placeholder, inputRef, value, handleChange, handleFocus, handleBlur, handleKeyDown } =
        useSearchFieldContext();

    return (
        <StyledInput
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
    const styleProps: SearchFieldClearButtonStyleProps = {
        $display: isFocused && value ? 'block' : 'none',
    };
    const handleClearMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    }, []);

    return (
        <StyledIconTextClear onMouseDown={handleClearMouseDown} onClick={handleClear} {...styleProps}>
            <IconTextClear />
        </StyledIconTextClear>
    );
};

const StyledContainer = styled.div<SearchFieldContainerStyleProps>`
    position: relative;
    display: grid;
    grid-template-columns: ${(props) => props.$gridTemplate};
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    padding: 0 11px;
    width: ${(props) => props.$width};
    height: ${(props) => props.$height}px;
    border: 1px solid ${theme.colors.grey40};
    border-radius: 4px;

    &:hover,
    &:focus-within {
        border-color: ${theme.colors.blue500};
    }

    & > svg,
    & > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const StyledInput = styled.input`
    padding: 0;
    width: 100%;
    border: none;
    font-size: 18px;
    line-height: 24px;

    &::placeholder {
        color: ${theme.colors.grey40};
    }
`;

const StyledIconSearch = styled(IconSearch)`
    width: 24px;
    height: 24px;
    color: ${theme.colors.grey50};
`;

const StyledIconTextClear = styled.button<SearchFieldClearButtonStyleProps>`
    display: ${(props) => props.$display};
    width: 24px;
    height: 24px;
`;
