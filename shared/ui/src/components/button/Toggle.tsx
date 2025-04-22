import { useCallback, useState } from 'react';

interface ButtonProps {
    onChange?: (active: boolean) => void;
}

export const Toggle = ({ onChange = () => {} }: ButtonProps) => {
    const [active, setActive] = useState(false);
    const bgStyle = active ? 'bg-blue-500' : 'bg-grey-30';
    const transformStyle = active ? '-translate-x-[-14px]' : '-translate-x-0';

    const handleClick = useCallback(() => {
        setActive((prev) => {
            onChange?.(!prev);
            return !prev;
        });
    }, [onChange]);

    return (
        <div
            className={`flex h-[24px] min-h-[24px] w-[39px] min-w-[39px] cursor-pointer rounded-[24px] p-[3px] transition-colors duration-100 ${bgStyle}`}
            onClick={handleClick}
        >
            <div
                className={`size-[18px] transform rounded-[18px] bg-white transition-transform duration-200 ${transformStyle}`}
            />
        </div>
    );
};
