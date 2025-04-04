import React, { useState, useRef, KeyboardEvent, useCallback } from 'react';
import { useInput } from '@/hooks/useInput.ts';

const useSearchField = (
    initialValue?: string,
    onChange?: (value: string) => void,
    onDone?: (value: string) => void,
) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { value, setValue, handleChange } = useInput<HTMLInputElement>({
        initialValue,
        onChange,
    });

    const handleClear = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            setValue('');
            inputRef.current?.focus();
        },
        [setValue],
    );

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
