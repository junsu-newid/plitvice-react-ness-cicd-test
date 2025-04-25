import { ReactNode } from 'react';

interface DrawerProps {
    width?: number;
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

export const Drawer = ({ width = 0, open, onClose, children, className = '' }: DrawerProps) => {
    const drawerWidth = { width: width > 0 ? `${width}px` : 'fit-content' };
    return (
        <>
            {open && <div className="z-800 fixed inset-0 bg-[rgba(0,0,0,0.4)] transition-opacity" onClick={onClose} />}
            <div
                className={`z-900 fixed right-0 top-0 h-full transform bg-white shadow-lg transition-transform duration-300 ${
                    open ? 'translate-x-0' : 'translate-x-full'
                } ${className}`}
                style={drawerWidth}
            >
                {children}
            </div>
        </>
    );
};
