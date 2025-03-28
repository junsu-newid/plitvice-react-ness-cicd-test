import { ButtonProps } from '@/components/button/Button.types.ts';

export const Button = ({ size = 'middle', variant = 'fill', children, ref, ...props }: ButtonProps) => {
    // Base classes that will be applied to all buttons
    const baseClasses = 'font-medium rounded cursor-pointer transition-colors duration-100';

    // Size-specific classes
    let sizeClasses = '';
    switch (size) {
        case 'small':
            sizeClasses = 'text-xs h-[26px] px-[10px]';
            break;
        case 'middle':
            sizeClasses = 'text-xs h-[32px] px-[14px]';
            break;
        case 'large':
            sizeClasses = 'text-base h-[54px] px-[20px]';
            break;
    }

    // Style classes based on variant and disabled state
    let styleClasses = '';

    if (props.disabled) {
        // Disabled state styling
        if (variant === 'fill') {
            styleClasses = 'bg-gray-200 text-gray-400 border-none';
        } else {
            styleClasses = 'bg-gray-200 text-gray-400 border border-solid border-gray-400';
        }
    } else if (variant === 'fill') {
        // Fill variant (non-disabled)
        styleClasses = 'bg-blue-600 text-white border-none hover:bg-blue-500 active:bg-blue-700';
    } else {
        // Outline variant (non-disabled)
        styleClasses =
            'bg-white text-gray-500 border border-solid border-gray-500 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-600 active:bg-blue-200 active:text-blue-700 active:border-blue-700';
    }

    // Combine all classes
    const buttonClasses = `${baseClasses} ${sizeClasses} ${styleClasses}`;

    return (
        <button role="button" ref={ref} className={buttonClasses} {...props}>
            {children || ''}
        </button>
    );
};
