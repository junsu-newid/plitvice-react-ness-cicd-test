import CopierIcon from '@/assets/icCopier.svg?react';

interface Props {
    value: string;
    className?: string;
}

function TextCopier({ value, className = '' }: Props) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
        } catch (e) {
            console.error('Copy failed', e);
        }
    };

    return (
        <div className={`flex items-center justify-center gap-[4px]`}>
            <p className={`text-r16 ${className}`}>{value}</p>
            <button onClick={handleCopy} className={`text-grey-50 hover:text-blue-600`}>
                <CopierIcon />
            </button>
        </div>
    );
}
export { TextCopier };
