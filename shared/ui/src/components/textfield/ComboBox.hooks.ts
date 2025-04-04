import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { SelectOption } from '@/components/textfield/ComboBox.types.ts';
import { useInput } from '@/hooks/useInput.ts';

const useSelectBox = (
    initialValue?: string,
    onChange?: (value: string) => void,
    onInputChange?: (value: string) => void,
    showAllOptionsOnFocus: boolean = true,
    allowCustomValue: boolean = true,
) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [optionList, setOptionList] = useState<SelectOption[]>([]);
    const [filteredOptionList, setFilteredOptionList] = useState<SelectOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(initialValue);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        value: inputValue,
        setValue: setInputValue,
        handleChange: handleInputChange,
    } = useInput<HTMLInputElement>({
        initialValue,
        onChange: (newValue: string) => {
            if (onInputChange) {
                onInputChange(newValue);
            }

            if (newValue.trim() === '') {
                setFilteredOptionList(optionList);
            } else {
                const filtered = optionList.filter((option) =>
                    option.label.toLowerCase().includes(newValue.toLowerCase()),
                );
                setFilteredOptionList(filtered);
            }
        },
    });
    const resetToLastSelectedOption = useCallback(() => {
        const selectedOption = optionList.find((option) => option.value === selectedValue);

        if (selectedOption) {
            setInputValue(selectedOption.label);
            onInputChange?.(selectedOption.value);
        } else {
            setInputValue('');
            onInputChange?.('');
        }
    }, [optionList, selectedValue, onInputChange, setInputValue]);

    useEffect(() => {
        if (optionList.length > 0 && initialValue !== undefined && initialValue !== selectedValue) {
            const selectedOption = optionList.find((option) => option.value === initialValue);
            if (selectedOption) {
                setInputValue(selectedOption.label);
                setSelectedValue(initialValue);
            }
        } else {
            setInputValue(initialValue || '');
        }
    }, [initialValue, optionList, setInputValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);

                if (!allowCustomValue && inputValue) {
                    resetToLastSelectedOption();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [allowCustomValue, inputValue, resetToLastSelectedOption]);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
        if (showAllOptionsOnFocus) {
            setFilteredOptionList(optionList);
        }
    }, [showAllOptionsOnFocus, optionList]);

    const toggleDropdown = useCallback(() => {
        const length = inputRef.current?.value.length;
        if (length) {
            inputRef.current?.setSelectionRange(length, length);
        }

        if (isFocused) {
            inputRef.current?.blur();
            setIsFocused(false);

            if (!allowCustomValue) {
                resetToLastSelectedOption();
            }
        } else {
            if (inputRef.current) {
                inputRef.current.focus();
            }

            setFilteredOptionList(optionList);
        }
    }, [optionList, isFocused, resetToLastSelectedOption, inputRef]);

    const handleOptionClick = useCallback(
        (option: SelectOption) => {
            setInputValue(option.label);
            setSelectedValue(option.value);
            setIsFocused(false);

            if (onChange) {
                onChange(option.value);
            }

            inputRef.current?.blur();
        },
        [onChange, setInputValue],
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();

                const matchingOption = optionList.find(
                    (option) => option.label.toLowerCase() === inputValue.toLowerCase(),
                );

                if (!inputValue) {
                    setIsFocused(false);
                    e.currentTarget.blur();
                } else if (matchingOption) {
                    setIsFocused(false);
                    e.currentTarget.blur();

                    onChange?.(matchingOption.value);
                    setSelectedValue(matchingOption.value);
                } else if (allowCustomValue) {
                    setIsFocused(false);
                    e.currentTarget.blur();

                    onChange?.(inputValue);
                    setSelectedValue(inputValue);
                }
            } else if (e.key === 'Escape') {
                setIsFocused(false);
                e.currentTarget.blur();

                if (!allowCustomValue && inputValue) {
                    resetToLastSelectedOption();
                }
            } else if (e.key === 'Tab') {
                setIsFocused(false);

                if (!allowCustomValue && inputValue) {
                    resetToLastSelectedOption();
                }
            }
        },
        [allowCustomValue, inputValue, resetToLastSelectedOption, optionList, onChange],
    );

    return {
        isFocused,
        inputValue,
        selectedValue,
        filteredOptionList,
        containerRef,
        inputRef,
        setIsFocused,
        setInputValue,
        setOptionList,
        handleInputChange,
        handleInputFocus,
        toggleDropdown,
        handleOptionClick,
        handleKeyDown,
    };
};
export default useSelectBox;
