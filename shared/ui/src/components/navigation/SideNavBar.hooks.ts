import { useEffect, useState } from 'react';

export const useSideBar = (defaultSelected: string, onChange: (value: string) => void) => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [selectedItem, setSelectedItem] = useState<string>(defaultSelected);
    const [parentChildMap, setParentChildMap] = useState<Record<string, string>>({});

    const expandParentCategories = (itemId: string) => {
        const expandedCategories: Record<string, boolean> = {};
        let currentParent = parentChildMap[itemId];

        while (currentParent) {
            expandedCategories[currentParent] = true;
            currentParent = parentChildMap[currentParent];
        }

        setExpandedItems((prev) => ({
            ...prev,
            ...expandedCategories,
        }));
    };

    const toggleDropdown = (id: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleItemClick = (id: string) => {
        setSelectedItem(id);
    };

    const registerNavItem = (id: string, hasChildren: boolean, parentId?: string) => {
        if (hasChildren) {
            setExpandedItems((prev) => {
                if (id in prev) return prev;
                return { ...prev, [id]: false };
            });
        }

        if (parentId) {
            setParentChildMap((prev) => ({
                ...prev,
                [id]: parentId,
            }));
        }
    };

    const isExpandable = (id: string) => {
        return id in expandedItems;
    };

    const getSelectedItemParent = () => {
        return parentChildMap[selectedItem];
    };

    const isParentOfSelected = (id: string) => {
        return parentChildMap[selectedItem] === id;
    };

    useEffect(() => {
        if (defaultSelected) {
            expandParentCategories(defaultSelected);
        }
    }, [defaultSelected, parentChildMap]);

    useEffect(() => onChange(selectedItem), [onChange, selectedItem]);

    return {
        expandedItems,
        selectedItem,
        toggleDropdown,
        handleItemClick,
        registerNavItem,
        isExpandable,
        isParentOfSelected,
        getSelectedItemParent,
    };
};
