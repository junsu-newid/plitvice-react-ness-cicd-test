import React, { Children, createContext, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useSideBar } from '@/components/navigation/SideNavBar.hooks.ts';
import {
    SideNavBarDropdownItemProps,
    SideNavBarItemProps,
    SideNavBarProps,
    SideNavBarItemStyleProps,
    SideNavBarStyleProps,
    SideNavBarDropdownStyleProps,
} from '@/components/navigation/SideNavBar.types.ts';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';
import { theme } from '@/styles/theme.ts';

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
    const styleProps: SideNavBarStyleProps = {
        $width: width > 0 ? `${width}px` : '100%',
    };

    return (
        <SideNavBarContext.Provider value={state}>
            <StyledContainer className={'non-draggable'} {...styleProps}>
                {children}
            </StyledContainer>
        </SideNavBarContext.Provider>
    );
};

const NavItem = ({ id, label, children }: SideNavBarItemProps) => {
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

    const styleProps: SideNavBarItemStyleProps = {
        $fontColor: isSelected || isActiveParent ? theme.colors.blue700 : theme.colors.grey90,
        $bgColor: isSelected ? theme.colors.blue100 : theme.colors.transparent,
        $hoverBgColor: isSelected ? theme.colors.blue100 : theme.colors.grey10,
    };

    useEffect(() => {
        registerNavItem(id, hasChildren);
    }, [id, hasChildren]);

    return (
        <>
            <StyledItemWrapper onClick={() => (expandable ? toggleDropdown(id) : handleItemClick(id))} {...styleProps}>
                {label}
                {expandable && <StyledDropdownIcon $expanded={isExpanded} />}
            </StyledItemWrapper>

            {expandable && children && (
                <StyledDropdownContainer $expanded={isExpanded}>{childrenWithProps}</StyledDropdownContainer>
            )}
        </>
    );
};

const DropdownItem = ({ id, label, parentId }: SideNavBarDropdownItemProps) => {
    const { selectedItem, handleItemClick, registerNavItem } = useSideNavBarContext();
    const isSelected = selectedItem === id;
    const styleProps: SideNavBarItemStyleProps = {
        $fontColor: isSelected ? theme.colors.blue700 : theme.colors.grey90,
        $bgColor: isSelected ? theme.colors.blue100 : theme.colors.transparent,
        $hoverBgColor: isSelected ? theme.colors.blue100 : theme.colors.grey10,
    };

    useEffect(() => {
        if (parentId) {
            registerNavItem(id, false, parentId);
        }
    }, [id, parentId]);

    return (
        <StyledDropdownItem onClick={() => handleItemClick(id)} {...styleProps}>
            {label}
        </StyledDropdownItem>
    );
};

SideNavBar.Item = NavItem;
SideNavBar.DropdownItem = DropdownItem;
export { SideNavBar };

const StyledContainer = styled.nav<SideNavBarStyleProps>`
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
    width: ${(props) => props.$width};
    height: 100vh;
    border-right: 1px solid ${theme.colors.grey20};
    overflow-y: scroll;
`;

const StyledItemWrapper = styled.div<SideNavBarItemStyleProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px 10px 12px;
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    color: ${(props) => props.$fontColor};
    background-color: ${(props) => props.$bgColor};
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.1s ease;

    &:hover {
        background-color: ${(props) => props.$hoverBgColor};
    }

    svg {
        color: ${(props) => props.$fontColor};
    }
`;

const StyledDropdownIcon = styled(DropdownIcon)<SideNavBarDropdownStyleProps>`
    transition: transform 0.1s ease;
    transform: ${(props) => (props.$expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const StyledDropdownContainer = styled.div<SideNavBarDropdownStyleProps>`
    display: ${(props) => (props.$expanded ? 'block' : 'none')};
`;

const StyledDropdownItem = styled.div<SideNavBarItemStyleProps>`
    padding: 10px 10px 10px 24px;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    color: ${(props) => props.$fontColor};
    background-color: ${(props) => props.$bgColor};
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.$hoverBgColor};
    }
`;
