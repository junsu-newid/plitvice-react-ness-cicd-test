import React from 'react';

export interface SideNavBarProps {
    width?: number;
    navMap: SideNavMap[];
    defaultSelected?: string;
    onChange?: (value: string) => void;
    onNavigate?: (path: string) => void;
}

export interface SideNavBarItemProps {
    path: string;
    label: string;
    onClick?: (path: string) => void;
    children?: React.ReactNode;
}

export interface SideNavBarSubItemProps {
    path: string;
    label: string;
    parentPath?: string;
    onClick?: (path: string) => void;
}

interface SideNavMap {
    path: string;
    label: string;
    child?: SideNavMap[];
}
export type { SideNavMap };
