import React, { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { SelectOption } from '@/components/selectbox/DropdownList.tsx';

const useComboBox = (
    initialValue: SelectOption,
    list: SelectOption[],
    onChange?: (selected: SelectOption) => void,
    onInputChange?: (value: string) => void,
    showAllOptionsOnFocus: boolean = true,
    allowCustomValue: boolean = true,
) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState(initialValue.label);
    const [filteredList, setFilteredList] = useState<SelectOption[]>([]);
    const [selectedItem, setSelectedItem] = useState<SelectOption>(initialValue);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            setInputValue(newValue);
            onInputChange?.(newValue);

            if (newValue.trim() === '') {
                setFilteredList(list);
            } else {
                const filtered = list.filter((option) => option.label.toLowerCase().includes(newValue.toLowerCase()));
                setFilteredList(filtered);
            }
        },
        [list, onInputChange],
    );

    const resetToLastSelectedOption = useCallback(() => {
        const selectedOption = list.find((option) => option === selectedItem);

        if (selectedOption) {
            setInputValue(selectedOption.label);
            onInputChange?.(selectedOption.label);
        } else {
            setInputValue('');
            onInputChange?.('');
        }
    }, [list, selectedItem, onInputChange]);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
        if (showAllOptionsOnFocus) {
            setFilteredList(list);
        }
    }, [showAllOptionsOnFocus, list]);

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
            setIsFocused(true);
            setFilteredList(list);
        }
    }, [list, allowCustomValue, isFocused, resetToLastSelectedOption]);

    const handleSelected = useCallback(
        (option: SelectOption) => {
            setInputValue(option.label);
            setSelectedItem(option);
            setIsFocused(false);
            onChange?.(option);
            onInputChange?.(option.label);
            inputRef.current?.blur();
        },
        [onChange, onInputChange],
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();

                const matchingOption = list.find((option) => option.label.toLowerCase() === inputValue.toLowerCase());

                if (!inputValue) {
                    setIsFocused(false);
                    e.currentTarget.blur();
                } else if (matchingOption) {
                    setIsFocused(false);
                    e.currentTarget.blur();

                    onChange?.(matchingOption);
                    setSelectedItem(matchingOption);
                } else if (allowCustomValue) {
                    setIsFocused(false);
                    e.currentTarget.blur();

                    const customOption: SelectOption = {
                        value: inputValue,
                        label: inputValue,
                    };
                    onChange?.(customOption);
                    setSelectedItem(customOption);
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
        [allowCustomValue, resetToLastSelectedOption, list, onChange],
    );

    useEffect(() => {
        if (list.length > 0 && initialValue?.value !== undefined && initialValue.value !== selectedItem.value) {
            const selectedOption = list.find((option) => option.value === initialValue.value);
            if (selectedOption) {
                setInputValue(selectedOption.label);
                setSelectedItem(initialValue);
            }
        } else if (initialValue?.label) {
            setInputValue(initialValue.label);
        }
    }, [initialValue, list, selectedItem]);

    useEffect(() => {
        if (list.length > 0) {
            if (isFocused && (inputValue.trim() === '' || showAllOptionsOnFocus)) {
                setFilteredList(list);
            } else {
                const filtered = list.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
                setFilteredList(filtered);
            }
        }
    }, [list, isFocused, showAllOptionsOnFocus]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);

                if (!allowCustomValue && inputValue) {
                    resetToLastSelectedOption();
                }
            }
        };

        if (isFocused) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [allowCustomValue, isFocused, resetToLastSelectedOption]);

    return {
        isFocused,
        inputValue,
        selectedItem,
        filteredList,
        containerRef,
        inputRef,
        handleInputChange,
        handleInputFocus,
        toggleDropdown,
        handleSelected,
        handleKeyDown,
    };
};
export default useComboBox;
