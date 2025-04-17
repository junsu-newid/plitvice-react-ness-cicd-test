import { BoxComponentStyles, LabelPosition, Size } from '@/types/common.ts';
import useTextField from '@/components/textfield/TextField.hooks.ts';

type TextFieldSize = Extract<Size, 'medium' | 'large'>;

export interface TextFieldProps {
    size?: TextFieldSize;
    width?: number;
    label?: string;
    labelColor?: string;
    labelPosition?: LabelPosition;
    value?: string;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
    onDone?: (value: string) => void;
}

const TextField = ({
    size = 'medium',
    width = 0,
    placeholder = 'Placeholder',
    value: initialValue = '',
    label = '',
    labelColor = '',
    labelPosition = 'outer',
    disabled = false,
    readOnly = false,
    onChange = () => {},
    onDone = () => {},
}: TextFieldProps) => {
    const { inputRef, isFocused, value, handleChange } = useTextField(initialValue, onChange, onDone);

    const widthStyle = { width: width > 0 ? `${width}px` : '100%' };
    const labelTextStyle = {
        color: labelColor || (labelPosition === 'outer' ? 'var(--color-grey-70)' : 'var(--color-grey-50)'),
    };

    const { labelText: labelTextClass, inputText: inputTextClass, heightClass } = BoxComponentStyles[size];
    const bgClass = disabled ? 'bg-grey-20' : 'bg-white';
    const borderClass = isFocused ? 'border-blue-500' : 'border-grey-40';

    return (
        <div className={`relative flex h-fit flex-col items-start gap-[4px]`} style={widthStyle}>
            {labelPosition === 'outer' && label !== '' ? (
                <label className={`pl-[4px] ${labelTextClass} non-draggable`} style={labelTextStyle}>
                    {label}
                </label>
            ) : null}

            <div
                className={`flex w-full items-center rounded-[4px] border-[1px] p-0 ${heightClass} ${bgClass} ${borderClass}`}
            >
                <div className={`flex h-full w-full flex-col justify-center px-[11px]`}>
                    {labelPosition === 'inner' && label !== '' && size === 'large' ? (
                        <label className={`text-m12 non-draggable p-0`} style={labelTextStyle}>
                            {label}
                        </label>
                    ) : null}
                    <input
                        className={`placeholder:text-grey-40 w-full ${inputTextClass}`}
                        placeholder={placeholder}
                        value={value}
                        readOnly={readOnly}
                        disabled={disabled}
                        onChange={handleChange}
                        ref={inputRef}
                    />
                </div>
            </div>
        </div>
    );
};
export { TextField };
