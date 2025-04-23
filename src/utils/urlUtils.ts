export function getParam(key: string): string | null {
    return new URLSearchParams(window.location.search).get(key);
}

export function setParam(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, '', url.toString());
}
