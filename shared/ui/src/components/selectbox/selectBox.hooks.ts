import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectOption } from '@/components/selectbox/DropdownList.tsx';

interface SelectBoxHookProps {
    initialValue?: SelectOption;
    onChange?: (selected: SelectOption) => void;
}

const useSelectBox = ({ initialValue, onChange }: SelectBoxHookProps) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState(initialValue);

    const containerRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = useCallback(() => {
        setIsFocused((prev) => !prev);
    }, []);

    const handleSelected = useCallback(
        (option: SelectOption) => {
            setSelectedItem(option);
            setIsFocused(false);
            onChange?.(option);
        },
        [onChange],
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        if (isFocused) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFocused]);

    return {
        isFocused,
        selectedItem,
        containerRef,
        toggleDropdown,
        handleSelected,
    };
};
export default useSelectBox;
