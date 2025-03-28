import React from 'react';

export interface SideNavBarProps {
    width?: number;
    defaultSelected?: string;
    onChange?: (value: string) => void;
    children: React.ReactNode;
}

export interface SideNavBarStyleProps {
    width?: string;
}

export interface SideNavBarItemProps {
    id: string;
    label: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

export interface SideNavBarDropdownItemProps {
    id: string;
    label: string;
    parentId?: string;
    onClick?: () => void;
}
