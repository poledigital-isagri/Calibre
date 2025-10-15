export interface StoredText {
    token: string;
    content: string;
    preview: string;
    lastModified: Date;
    limite: number;
}

export function useTextStorage() {
    function getStoredText(token: string): string {
        return localStorage.getItem(`txt_${token}`) || '';
    }

    function saveText(token: string, content: string, limite?: number) {
        localStorage.setItem(`txt_${token}`, content);
        if (limite !== undefined) {
            localStorage.setItem(`limit_${token}`, limite.toString());
        }
    }

    function getStoredLimit(token: string): number {
        const stored = localStorage.getItem(`limit_${token}`);
        return stored ? parseInt(stored) : 150; // Default to 150 if not found
    }

    function getOrCreateToken(): string {
        const url = new URL(window.location.href);
        let token = url.searchParams.get('id');
        if (!token) {
            token = crypto.randomUUID();
            url.searchParams.set('id', token);
            window.history.replaceState(null, '', url.toString());
        }
        return token;
    }

    function getAllStoredTexts(): StoredText[] {
        const texts: StoredText[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('txt_')) {
                const token = key.replace('txt_', '');
                const content = localStorage.getItem(key) || '';

                if (content.trim()) { // Only include non-empty texts
                    const preview = content.length > 50
                        ? content.substring(0, 50) + '...'
                        : content;

                    // Get the stored limit for this token
                    const limite = getStoredLimit(token);

                    // Try to get last modified date from browser storage or use current date
                    const lastModified = new Date();

                    texts.push({
                        token,
                        content,
                        preview,
                        lastModified,
                        limite
                    });
                }
            }
        }

        // Sort by last modified (most recent first)
        return texts.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    }

    function deleteStoredText(token: string) {
        localStorage.removeItem(`txt_${token}`);
        localStorage.removeItem(`limit_${token}`);
    }

    return {
        getStoredText,
        saveText,
        getOrCreateToken,
        getAllStoredTexts,
        deleteStoredText,
        getStoredLimit
    };
}
