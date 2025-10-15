// Structure de données stockée dans le localStorage
interface StoredTextData {
    content: string;
    limite: number;
    lastModified: number; // timestamp
}

// Interface pour l'affichage (avec propriétés calculées)
export interface StoredText {
    token: string;
    content: string;
    preview: string;
    lastModified: Date;
    limite: number;
}

const STORAGE_PREFIX = 'calibre_text_';
const DEFAULT_LIMIT = 150;

export function useTextStorage() {
    /**
     * Récupère les données complètes d'un texte depuis le localStorage
     */
    function getStoredTextData(token: string): StoredTextData | null {
        const key = `${STORAGE_PREFIX}${token}`;
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        try {
            return JSON.parse(stored) as StoredTextData;
        } catch (error) {
            console.error('Erreur lors de la lecture du texte:', error);
            return null;
        }
    }

    /**
     * Récupère uniquement le contenu d'un texte
     */
    function getStoredText(token: string): string {
        const data = getStoredTextData(token);
        return data?.content || '';
    }

    /**
     * Sauvegarde un texte avec sa limite dans le localStorage
     */
    function saveText(token: string, content: string, limite: number = DEFAULT_LIMIT) {
        const key = `${STORAGE_PREFIX}${token}`;
        const data: StoredTextData = {
            content,
            limite,
            lastModified: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Récupère la limite d'un texte (source de vérité: localStorage)
     */
    function getStoredLimit(token: string): number {
        const data = getStoredTextData(token);
        return data?.limite || DEFAULT_LIMIT;
    }

    /**
     * Génère un nouveau token UUID
     */
    function generateToken(): string {
        return crypto.randomUUID();
    }

    /**
     * Récupère le token depuis l'URL
     */
    function getTokenFromUrl(): string | null {
        const url = new URL(window.location.href);
        return url.searchParams.get('id');
    }

    /**
     * Récupère ou crée un nouveau token
     */
    function getOrCreateToken(): string {
        let token = getTokenFromUrl();
        if (!token) {
            token = generateToken();
        }
        return token;
    }

    /**
     * Récupère tous les textes sauvegardés
     */
    function getAllStoredTexts(): StoredText[] {
        const texts: StoredText[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) {
                const token = key.replace(STORAGE_PREFIX, '');
                const data = getStoredTextData(token);

                if (data && data.content.trim()) {
                    const preview = data.content.length > 50
                        ? data.content.substring(0, 50) + '...'
                        : data.content;

                    texts.push({
                        token,
                        content: data.content,
                        preview,
                        lastModified: new Date(data.lastModified),
                        limite: data.limite
                    });
                }
            }
        }

        // Trier par date de modification (plus récent en premier)
        return texts.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    }

    /**
     * Supprime un texte du localStorage
     */
    function deleteStoredText(token: string) {
        const key = `${STORAGE_PREFIX}${token}`;
        localStorage.removeItem(key);
    }

    /**
     * Migre les anciennes données vers le nouveau format (si nécessaire)
     */
    function migrateOldData() {
        const oldKeys: string[] = [];

        // Détecter les anciennes clés
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('txt_') || key.startsWith('limit_'))) {
                oldKeys.push(key);
            }
        }

        // Migrer les données
        const tokens = new Set<string>();
        oldKeys.forEach(key => {
            if (key.startsWith('txt_')) {
                tokens.add(key.replace('txt_', ''));
            }
        });

        tokens.forEach(token => {
            const content = localStorage.getItem(`txt_${token}`) || '';
            const limitStr = localStorage.getItem(`limit_${token}`);
            const limite = limitStr ? parseInt(limitStr) : DEFAULT_LIMIT;

            if (content) {
                saveText(token, content, limite);
                localStorage.removeItem(`txt_${token}`);
                localStorage.removeItem(`limit_${token}`);
            }
        });
    }

    return {
        getStoredText,
        getStoredTextData,
        saveText,
        getStoredLimit,
        getOrCreateToken,
        generateToken,
        getTokenFromUrl,
        getAllStoredTexts,
        deleteStoredText,
        migrateOldData
    };
}
