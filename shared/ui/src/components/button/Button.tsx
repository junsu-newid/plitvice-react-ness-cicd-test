import React, { ReactNode } from 'react';
import { CustomComponentProps, Size } from '@/types/common.ts';

interface ButtonProps extends CustomComponentProps<'button'> {
    size?: Extract<Size, 'small' | 'medium' | 'large'>;
    variant?: 'default' | 'normal' | 'alert';
    fill?: boolean;
    children?: ReactNode;
    ref?: React.Ref<HTMLButtonElement>;
}

const ButtonSizeStyles = {
    small: {
        padding: 'py-[6px] px-[10px]',
        text: 'text-m14',
    },
    medium: {
        padding: 'py-[10px] px-[14px]',
        text: 'text-m16',
    },
    large: {
        padding: 'py-[15px] px-[20px]',
        text: 'text-m18',
    },
};

const ButtonVariantStyles = {
    default: {
        bgColor: 'bg-grey-5',
        borderColor: 'border-grey-5',
        textColor: 'text-grey-70',
        fillHoverBgColor: 'hover:bg-grey-5',
        fillPressedBgColor: 'active:bg-grey-5',
        strokeHoverBgColor: 'hover:bg-grey-5',
        strokePressedBgColor: 'active:bg-grey-5',
    },
    normal: {
        bgColor: 'bg-blue-600',
        borderColor: 'border-blue-600',
        textColor: 'text-blue-600',
        fillHoverBgColor: 'hover:bg-blue-500',
        fillPressedBgColor: 'active:bg-blue-700',
        strokeHoverBgColor: 'hover:bg-blue-200',
        strokePressedBgColor: 'active:bg-blue-300',
    },
    alert: {
        bgColor: 'bg-red-600',
        borderColor: 'border-red-600',
        textColor: 'text-red-600',
        fillHoverBgColor: 'hover:bg-red-500',
        fillPressedBgColor: 'active:bg-red-700',
        strokeHoverBgColor: 'hover:bg-red-200',
        strokePressedBgColor: 'active:bg-red-300',
    },
};

export const Button = ({ size = 'medium', variant = 'default', fill = true, children, ref, ...props }: ButtonProps) => {
    const baseClasses = `${ButtonSizeStyles[size].padding} h-fit ${ButtonSizeStyles[size].text} font-medium rounded-[4px] border border-solid transition-colors duration-100`;
    let bgColor = fill ? ButtonVariantStyles[variant].bgColor : 'bg-transparent';
    let borderColor = ButtonVariantStyles[variant].borderColor;
    let textColor = fill ? 'text-grey-90' : ButtonVariantStyles[variant].textColor;

    let behaveClasses = '';
    if (props.disabled) {
        bgColor = 'bg-grey-20';
        borderColor = fill ? 'border-grey-20' : 'border-grey-40';
        textColor = 'text-grey-40';
    } else {
        if (fill) {
            behaveClasses = `${ButtonVariantStyles[variant].fillHoverBgColor} ${ButtonVariantStyles[variant].fillPressedBgColor}`;
        } else {
            behaveClasses = `${ButtonVariantStyles[variant].strokeHoverBgColor} ${ButtonVariantStyles[variant].strokePressedBgColor}`;
        }
    }

    const buttonClasses = `${baseClasses} ${behaveClasses} ${bgColor} ${borderColor} ${textColor}`;

    return (
        <button role="button" ref={ref} className={buttonClasses} {...props}>
            {children}
        </button>
    );
};
