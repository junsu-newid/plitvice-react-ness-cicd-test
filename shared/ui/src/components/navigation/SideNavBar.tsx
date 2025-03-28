import React, { Children, createContext, useContext, useEffect } from 'react';
import { useSideBar } from '@/components/navigation/SideNavBar.hooks.ts';
import {
    SideNavBarDropdownItemProps,
    SideNavBarItemProps,
    SideNavBarProps,
} from '@/components/navigation/SideNavBar.types.ts';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';

interface SideNavBarContextType {
    expandedItems: Record<string, boolean>;
    selectedItem: string;
    toggleDropdown: (id: string) => void;
    handleItemClick: (id: string) => void;
    registerNavItem: (id: string, hasChildren: boolean, parentId?: string) => void;
    isExpandable: (id: string) => boolean;
    isParentOfSelected: (id: string) => boolean;
    getSelectedItemParent: () => string | undefined;
}

const SideNavBarContext = createContext<SideNavBarContextType | undefined>(undefined);
const useSideNavBarContext = () => {
    const context = useContext(SideNavBarContext);
    if (!context) {
        throw new Error('SideNavBar components must be used within a SideNavBarProvider');
    }
    return context;
};

const SideNavBar = ({ width = 240, defaultSelected = '', onChange = () => {}, children }: SideNavBarProps) => {
    const state = useSideBar(defaultSelected, onChange);
    const widthStyle = width > 0 ? `w-[${width}px]` : 'w-full';

    return (
        <SideNavBarContext.Provider value={state}>
            <nav className={`flex flex-col p-4 ${widthStyle} non-draggable h-screen overflow-y-scroll`}>{children}</nav>
        </SideNavBarContext.Provider>
    );
};

const NavItem = ({ id, label, onClick, children }: SideNavBarItemProps) => {
    const {
        expandedItems,
        selectedItem,
        toggleDropdown,
        handleItemClick,
        registerNavItem,
        isExpandable,
        isParentOfSelected,
    } = useSideNavBarContext();
    const hasChildren = Children.count(children) > 0;
    const expandable = isExpandable(id);
    const isExpanded = expandable && expandedItems[id];
    const isSelected = selectedItem === id && !expandable;
    const isActiveParent = isParentOfSelected(id);
    const childrenWithProps = Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { parentId: id } as never);
        }
        return child;
    });

    const fontColorStyle = isSelected || isActiveParent ? 'text-blue-700' : 'text-gray-800';
    const bgColorStyle = isSelected ? 'bg-blue-100' : '';
    const hoverStyle = isSelected ? 'hover:bg-blue-100' : 'hover:bg-gray-100';

    useEffect(() => {
        registerNavItem(id, hasChildren);
    }, [id, hasChildren]);

    return (
        <>
            <div
                className={`flex cursor-pointer items-center justify-between rounded px-3 py-2.5 text-base font-medium leading-snug transition-all duration-100 ${fontColorStyle} ${bgColorStyle} ${hoverStyle}`}
                onClick={() => {
                    if (expandable) {
                        toggleDropdown(id);
                    } else {
                        handleItemClick(id);
                        onClick?.();
                    }
                }}
            >
                {label}
                {expandable && (
                    <DropdownIcon
                        className={`transition-transform duration-100 ${fontColorStyle} ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                    />
                )}
            </div>

            {expandable && children && <div className={isExpanded ? 'block' : 'hidden'}>{childrenWithProps}</div>}
        </>
    );
};

const DropdownItem = ({ id, label, parentId, onClick }: SideNavBarDropdownItemProps) => {
    const { selectedItem, handleItemClick, registerNavItem } = useSideNavBarContext();
    const isSelected = selectedItem === id;

    const fontColorStyle = isSelected ? 'text-blue-700' : 'text-gray-800';
    const bgColorStyle = isSelected ? 'bg-blue-100' : '';
    const hoverStyle = isSelected ? 'hover:bg-blue-100' : 'hover:bg-gray-100';

    useEffect(() => {
        if (parentId) {
            registerNavItem(id, false, parentId);
        }
    }, [id, parentId]);

    return (
        <div
            className={`cursor-pointer rounded px-6 py-2.5 text-sm font-normal leading-relaxed ${fontColorStyle} ${bgColorStyle} ${hoverStyle}`}
            onClick={() => {
                handleItemClick(id);
                onClick?.();
            }}
        >
            {label}
        </div>
    );
};

SideNavBar.Item = NavItem;
SideNavBar.DropdownItem = DropdownItem;
export { SideNavBar };
