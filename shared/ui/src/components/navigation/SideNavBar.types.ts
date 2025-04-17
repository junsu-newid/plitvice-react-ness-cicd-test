import React from 'react';

export interface SideNavBarProps {
    width?: number;
    navMap: SideNavMap[];
    defaultSelected?: string;
    onChange?: (value: string) => void;
    onNavigate?: (path: string) => void;
}

export interface SideNavBarItemProps {
    id: string;
    label: string;
    path?: string;
    onClick?: (path: string) => void;
    children?: React.ReactNode;
}

export interface SideNavBarSubItemProps {
    id: string;
    label: string;
    parentId?: string;
    path?: string;
    onClick?: (path: string) => void;
}

interface SideNavMap {
    id: string;
    label: string;
    path?: string;
    child?: SideNavMap[];
}
export type { SideNavMap };
