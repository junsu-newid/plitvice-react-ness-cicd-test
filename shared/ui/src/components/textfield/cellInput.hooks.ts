import { useState, useRef, useCallback } from 'react';
import { useInput } from '@/hooks/useInput.ts';

interface UseCellInputParams {
    initialValue?: string;
    onChange?: (value: string) => void;
    onDone?: (value: string) => void;
    onEnter?: () => void;
}

const useCellInput = ({ initialValue = '', onChange, onDone, onEnter }: UseCellInputParams) => {
    const [originValue, setOriginValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const { value, setValue, handleChange } = useInput<HTMLInputElement>({
        initialValue,
        onChange: (newValue) => onChange?.(newValue),
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const escKeyPressedRef = useRef(false);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        escKeyPressedRef.current = false;
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        if (!escKeyPressedRef.current && originValue !== value) {
            setOriginValue(value);
            onDone?.(value);
        }
    }, [onDone, originValue, value]);

    const handleReset = useCallback(() => {
        setValue(originValue);
        onChange?.(originValue);
    }, [originValue, setValue, onChange]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onEnter?.();
                inputRef.current?.blur();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                escKeyPressedRef.current = true;
                setValue(originValue);
                inputRef.current?.blur();
            }
        },
        [originValue, setValue],
    );

    const callbackRef = useCallback(
        (node: HTMLInputElement | null) => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('focus', handleFocus);
                inputRef.current.removeEventListener('blur', handleBlur);
                inputRef.current.removeEventListener('keydown', handleKeyDown);
            }
            if (node) {
                node.addEventListener('focus', handleFocus);
                node.addEventListener('blur', handleBlur);
                node.addEventListener('keydown', handleKeyDown);
            }
            inputRef.current = node;
        },
        [handleFocus, handleBlur, handleKeyDown],
    );

    return {
        inputRef: callbackRef,
        isModified: originValue !== value,
        isFocused,
        originValue,
        value,
        setValue,
        handleChange,
        handleReset,
    };
};
export default useCellInput;
