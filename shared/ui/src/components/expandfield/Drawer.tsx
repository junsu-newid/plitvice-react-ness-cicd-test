import { ReactNode } from 'react';

interface DrawerProps {
    width?: number;
    open: boolean;
    onClose: () => void;
    onTransitionEnd?: () => void;
    children: ReactNode;
    className?: string;
}

export const Drawer = ({ width = 0, open, onClose, onTransitionEnd, children, className = '' }: DrawerProps) => {
    const widthStyle = { width: width > 0 ? `${width}px` : 'fit-content' };
    const transformStyle = { transform: open ? 'translateX(0)' : 'translateX(100%)' };

    return (
        <>
            {open && <div className="z-800 fixed inset-0 bg-[rgba(0,0,0,0.30)] transition-opacity" onClick={onClose} />}
            <div
                className={`z-900 fixed right-0 top-0 h-full transform bg-white shadow-lg transition-transform duration-300 ${className}`}
                style={{ ...widthStyle, ...transformStyle }}
                onTransitionEnd={() => !open && onTransitionEnd?.()}
            >
                {children}
            </div>
        </>
    );
};
