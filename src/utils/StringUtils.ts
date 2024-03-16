const generateRandomHash = (length = 16) => {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);

    const hashArray = Array.from(randomBytes);
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

const hasText = (str: string | null | undefined) => {
    return str && str.trim() !== '';
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    generateRandomHash,
    hasText
}
