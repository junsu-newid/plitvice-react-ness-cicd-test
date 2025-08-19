const PBKDF2_ITERATIONS = 100000;

const getDailyKey = async (date: Date = new Date(), usage: KeyUsage[]) => {
    const dateStr = date.toISOString().split('T')[0];
    const salt = new TextEncoder().encode(dateStr);
    const masterKeyBytes = new TextEncoder().encode(process.env.SESSION_SECRETS);

    const masterKeyMaterial = await crypto.subtle.importKey('raw', masterKeyBytes, { name: 'PBKDF2' }, false, [
        'deriveKey',
    ]);

    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        masterKeyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        usage,
    );
};

const decryptData = async (encryptedData: Uint8Array, dailyKey: CryptoKey) => {
    const nonce = encryptedData.slice(0, 12);
    const tag = encryptedData.slice(12, 28);
    const ciphertext = encryptedData.slice(28);

    const dataToDecrypt = new Uint8Array(ciphertext.length + tag.length);
    dataToDecrypt.set(ciphertext, 0);
    dataToDecrypt.set(tag, ciphertext.length);

    const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, dailyKey, dataToDecrypt);

    return new Uint8Array(decryptedBuffer);
};

export const decodeKey = async (encodedText: string, referenceTime: Date = new Date()) => {
    try {
        const encrypted = Buffer.from(encodedText, 'base64');

        for (const delta of [0, -1]) {
            const dateToTry = new Date(referenceTime);
            dateToTry.setDate(referenceTime.getDate() + delta);

            try {
                const dailyKey = await getDailyKey(dateToTry, ['decrypt']);
                const decrypted = await decryptData(encrypted, dailyKey);
                return JSON.parse(new TextDecoder().decode(decrypted));
            } catch {
                continue;
            }
        }
    } catch (error) {
        console.error('Decoding failed:', error);
        return null;
    }

    return null;
};
