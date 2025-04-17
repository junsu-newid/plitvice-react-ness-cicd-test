interface CopyTextProps {
    value: string;
    className?: string;
}

function CopyText({ value, className = '' }: CopyTextProps) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
        } catch (e) {
            console.error('Copy failed', e);
        }
    };

    return (
        <p onClick={handleCopy} className={`non-draggable cursor-pointer ${className}`}>
            {value}
        </p>
    );
}
export { CopyText };
