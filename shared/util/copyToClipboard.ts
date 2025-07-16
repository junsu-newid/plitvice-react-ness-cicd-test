function copyToClipboard(text: string, onSuccess?: () => void): Promise<void> {
    return navigator.clipboard
        .writeText(text)
        .then(() => {
            onSuccess?.();
        })
        .catch((e) => {
            console.error('Copy failed', e);
        });
}

export { copyToClipboard };
