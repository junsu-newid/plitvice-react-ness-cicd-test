interface TextCopierProps {
    value: string;
    className?: string;
}

function TextCopier({ value, className = '' }: TextCopierProps) {
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
export { TextCopier };
