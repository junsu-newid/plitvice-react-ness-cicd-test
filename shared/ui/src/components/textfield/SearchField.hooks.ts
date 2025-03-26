import React, { useState, useRef, ChangeEvent, KeyboardEvent, useCallback } from 'react';

const useSearchField = (
    initialValue?: string,
    onChange?: (value: string) => void,
    onDone?: (value: string) => void,
) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [value, setValue] = useState<string>(initialValue || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setValue(newValue);
            onChange?.(newValue);
        },
        [onChange],
    );

    const handleClear = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setValue('');
        inputRef.current?.focus();
    }, []);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>, composing: boolean) => {
            if (e.key === 'Enter' && !composing) {
                e.stopPropagation();
                onDone?.(value);
                inputRef.current?.blur();
            } else if (e.key === 'Escape') {
                inputRef.current?.blur();
            } else if (e.key === 'Tab') {
                inputRef.current?.blur();
            }
        },
        [onDone, value],
    );

    return {
        isFocused,
        value,
        inputRef,
        setValue,
        handleChange,
        handleClear,
        handleFocus,
        handleBlur,
        handleKeyDown,
    };
};
export default useSearchField;
