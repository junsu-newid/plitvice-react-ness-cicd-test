import { useEffect, useState } from 'react';

export const useSideBar = (defaultSelected: string, onChange: (value: string) => void) => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [selectedItem, setSelectedItem] = useState<string>(defaultSelected);
    const [parentChildMap, setParentChildMap] = useState<Record<string, string>>({});
    const [pathToIdMap, setPathToIdMap] = useState<Record<string, string>>({});

    const selectItemByUrl = () => {
        const currentPath = window.location.pathname;
        let bestMatch = '';
        let bestMatchId = '';

        Object.entries(pathToIdMap).forEach(([path, id]) => {
            if (
                currentPath === path ||
                currentPath.startsWith(path + '/') ||
                (path !== '/' && currentPath.startsWith(path))
            ) {
                if (path.length > bestMatch.length) {
                    bestMatch = path;
                    bestMatchId = id;
                }
            }
        });

        if (bestMatchId) {
            setSelectedItem(bestMatchId);
            expandParentCategories(bestMatchId);
        }
    };

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

    const registerNavItem = (id: string, hasChildren: boolean, parentId?: string, path?: string) => {
        if (path) {
            setPathToIdMap((prev) => ({
                ...prev,
                [path]: id,
            }));
        }

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
        if (Object.keys(pathToIdMap).length > 0) {
            selectItemByUrl();
        } else if (defaultSelected) {
            expandParentCategories(defaultSelected);
        }
    }, [defaultSelected, parentChildMap, pathToIdMap]);

    useEffect(() => {
        const handleUrlChange = () => {
            selectItemByUrl();
        };

        window.addEventListener('popstate', handleUrlChange);

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, [pathToIdMap]);

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
