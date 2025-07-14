import { useState, useRef, useLayoutEffect } from 'react';

interface Props {
    displayText: string;
    tooltipText: string;
    className?: string;
    maxWidth?: number;
}

function TooltipBoxOnOverflow({ displayText, tooltipText, className, maxWidth = 280 }: Props) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(true);
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const checkOverflow = () => {
            const element = textRef.current;
            if (element) {
                setIsOverflowing(element.scrollHeight - 1 > element.clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [displayText, tooltipText]);

    const handleMouseEnter = () => {
        if (isOverflowing) {
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <p ref={textRef} className={`${className}`}>
                {displayText}
            </p>
            {showTooltip && (
                <div
                    className={`bg-grey-90 text-r14 absolute left-0 top-full z-10 mt-[12px] w-max max-w-[${maxWidth}px] break-all rounded-[6px] px-[12px] py-[10px] text-white shadow-lg`}
                    role="tooltip"
                >
                    {tooltipText}
                    <div className="border-b-grey-90 text-r14 absolute bottom-full left-[12px] h-0 w-0 border-x-[6px] border-b-[6px] border-x-transparent"></div>
                </div>
            )}
        </div>
    );
}
export { TooltipBoxOnOverflow };
