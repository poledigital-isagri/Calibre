export function useTextStorage() {
    function getStoredText(token: string): string {
        return localStorage.getItem(`txt_${token}`) || '';
    }

    function saveText(token: string, content: string) {
        localStorage.setItem(`txt_${token}`, content);
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

    return { getStoredText, saveText, getOrCreateToken };
}
