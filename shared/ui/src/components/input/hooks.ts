import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useInput } from '@/hooks/useInput.ts';

// const useTextField = (
//     initialValue?: string,
//     onChange?: (value: string) => void,
//     onInputChange?: (value: string) => void,
// ) => {
//     const [isFocused, setIsFocused] = useState<boolean>(false);
//
//     const inputRef = useRef<HTMLInputElement>(null);
//
//     const { value, setValue, handleChange } = useInput<HTMLInputElement>({
//         initialValue,
//         onChange: (newValue: string) => {
//             if (onInputChange) {
//                 onInputChange(newValue);
//             }
//         },
//     });
//
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
//                 setIsFocused(false);
//
//                 inputRef.current?.blur();
//             }
//         };
//
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//
//     const handleInputFocus = useCallback(() => {
//         setIsFocused(true);
//     }, []);
//
//     const handleKeyDown = useCallback(
//         (e: KeyboardEvent<HTMLInputElement>) => {
//             if (e.key === 'Enter') {
//                 e.preventDefault();
//
//                 setIsFocused(false);
//                 e.currentTarget.blur();
//             } else if (e.key === 'Escape') {
//                 setIsFocused(false);
//                 e.currentTarget.blur();
//             } else if (e.key === 'Tab') {
//                 setIsFocused(false);
//             }
//         },
//         [onChange],
//     );
//
//     return {
//         isFocused,
//         inputRef,
//         setIsFocused,
//         handleInputFocus,
//         handleKeyDown,
//         value,
//         setValue,
//         handleChange,
//     };
// };
// export default useTextField;

interface UseTextFieldProps {
    initialValue?: string;
    onChange?: (value: string) => void;
    onInputChange?: (value: string) => void;
    onEnter?: (value: string) => void;
    resetOnEscape?: boolean;
    updateOnBlur?: boolean;
}

const useTextField = ({
    initialValue = '',
    onChange,
    onInputChange,
    onEnter,
    resetOnEscape = false,
    updateOnBlur = false,
}: UseTextFieldProps = {}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [initialInputValue, setInitialInputValue] = useState<string>(initialValue);

    const inputRef = useRef<HTMLInputElement>(null);

    const { value, setValue, handleChange } = useInput<HTMLInputElement>({
        initialValue,
        onChange: (newValue: string) => {
            if (onInputChange) {
                onInputChange(newValue);
            }
        },
    });

    useEffect(() => {
        if (initialValue !== initialInputValue) {
            setValue(initialValue);
            setInitialInputValue(initialValue);
        }
    }, [initialValue, initialInputValue, setValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsFocused(false);

                if (updateOnBlur && onChange) {
                    onChange(value);
                }

                inputRef.current?.blur();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [updateOnBlur, onChange, value]);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();

                if (onEnter) {
                    onEnter(value);
                }

                if (onChange) {
                    onChange(value);
                }

                setIsFocused(false);
                e.currentTarget.blur();
            } else if (e.key === 'Escape') {
                setIsFocused(false);

                if (resetOnEscape) {
                    setValue(initialInputValue);
                }

                e.currentTarget.blur();
            } else if (e.key === 'Tab') {
                setIsFocused(false);
            }
        },
        [onChange, onEnter, value, resetOnEscape, initialInputValue, setValue],
    );

    return {
        isFocused,
        inputRef,
        setIsFocused,
        handleInputFocus,
        handleKeyDown,
        value,
        setValue,
        handleChange,
    };
};

export default useTextField;
