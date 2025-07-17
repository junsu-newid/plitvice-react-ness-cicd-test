import React, { useRef, useEffect, useState, useCallback, useId } from 'react';
import CheckmarkIcon from '@/assets/icCheckmark.svg?react';
import IndeterminateIcon from '@/assets/icIndeterminate.svg?react';

interface CheckboxProps {
    className?: string;
    id?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    children?: React.ReactNode;
}

export const Checkbox = ({
    className = '',
    id,
    disabled = false,
    indeterminate = false,
    checked,
    onChange,
    children,
}: CheckboxProps) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const checkboxId = id || generatedId;

    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const [uncontrolledChecked, setUncontrolledChecked] = useState(false);
    const isChecked = checked !== undefined ? checked : uncontrolledChecked;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        let value: boolean;

        if (indeterminate) {
            value = true;
        } else {
            value = event.target.checked;
        }

        if (checked === undefined) {
            setUncontrolledChecked(value);
        }

        onChange?.(value);
    };

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setIsPressed(false);
    }, []);

    const handleMouseDown = useCallback(() => !disabled && setIsPressed(true), [disabled]);
    const handleMouseUp = useCallback(() => setIsPressed(false), []);

    const getBoxClasses = () => {
        if (disabled) {
            return isChecked || indeterminate ? 'border-grey-30 bg-grey-30' : 'border-grey-30 bg-grey-10';
        }

        if (isChecked || indeterminate) {
            return isPressed ? 'border-blue-700 bg-blue-700' : 'border-blue-600 bg-blue-600';
        }

        return isPressed ? 'border-grey-40 bg-white' : 'border-grey-30 bg-white';
    };

    const renderIcon = () => {
        const iconColor = disabled ? 'text-grey-10' : 'text-white';

        if (indeterminate) {
            return <IndeterminateIcon className={iconColor} />;
        }

        if (isChecked) {
            return <CheckmarkIcon className={iconColor} />;
        }

        return null;
    };

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <label
            htmlFor={checkboxId}
            className={`inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        >
            <div className="relative">
                {/* Native input */}
                <input
                    ref={checkboxRef}
                    type="checkbox"
                    id={checkboxId}
                    className="sr-only"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                />

                {/* Click Area */}
                <div
                    className="relative flex h-[24px] w-[24px] items-center justify-center"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    {/* Hover background */}
                    {!disabled && isHovered && <div className="absolute inset-px rounded bg-blue-100" />}

                    {/* Checkbox */}
                    <div
                        className={`relative flex h-[16px] w-[16px] items-center justify-center rounded-[2px] border-[2px] transition-all duration-200 ${getBoxClasses()}`}
                    >
                        {renderIcon()}
                    </div>
                </div>
            </div>

            {/* Label */}
            {children && (
                <div className={`text-r16 pl-[4px] ${disabled ? 'text-grey-40' : 'text-grey-90'}`}>{children}</div>
            )}
        </label>
    );
};
