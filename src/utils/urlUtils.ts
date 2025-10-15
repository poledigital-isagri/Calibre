// utilitaire de récupèration et d'établissement des paramètres d'url
// sdegliame@isagri.fr | 20250424091611

/**
 * Récupère un paramètre depuis l'URL
 */
export function getParam(key: string): string | null {
    return new URLSearchParams(window.location.search).get(key);
}

/**
 * Définit un paramètre dans l'URL
 */
export function setParam(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, '', url.toString());
}

/**
 * Supprime un paramètre de l'URL
 */
export function deleteParam(key: string) {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState(null, '', url.toString());
}

/**
 * Définit plusieurs paramètres dans l'URL en une seule opération
 */
export function setParams(params: Record<string, string>) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    window.history.replaceState(null, '', url.toString());
}
