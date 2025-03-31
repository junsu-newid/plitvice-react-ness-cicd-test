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
    const widthStyle = { width: width > 0 ? `${width}px` : '100%' };

    return (
        <SideNavBarContext.Provider value={state}>
            <nav
                className={`non-draggable flex h-screen flex-col overflow-y-scroll px-[16px] py-[24px]`}
                style={widthStyle}
            >
                {children}
            </nav>
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

    const fontColorClass = isSelected || isActiveParent ? 'text-blue-700' : 'text-gray-800';
    const bgColorClass = isSelected ? 'bg-blue-100' : '';
    const hoverClass = isSelected ? 'hover:bg-blue-100' : 'hover:bg-gray-100';

    useEffect(() => {
        registerNavItem(id, hasChildren);
    }, [id, hasChildren]);

    return (
        <>
            <div
                className={`text-m16 flex cursor-pointer items-center justify-between rounded p-[10px] pl-[12px] transition-all duration-100 ${fontColorClass} ${bgColorClass} ${hoverClass}`}
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
                        className={`transition-transform duration-100 ${fontColorClass} ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
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

    const fontColorClass = isSelected ? 'text-blue-700' : 'text-gray-800';
    const bgColorClass = isSelected ? 'bg-blue-100' : '';
    const hoverClass = isSelected ? 'hover:bg-blue-100' : 'hover:bg-gray-100';

    useEffect(() => {
        if (parentId) {
            registerNavItem(id, false, parentId);
        }
    }, [id, parentId]);

    return (
        <div
            className={`text-r14 cursor-pointer rounded p-[10px] pl-[24px] ${fontColorClass} ${bgColorClass} ${hoverClass}`}
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
