<template>
  <main class="p-4">
    <div class="bg-surface-50 dark:bg-surface-950 p-10">
      <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
        <!-- Header avec titre et sélecteur de textes -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div class="flex-1">
            <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-2">Saisie calibrée de texte</div>
            <div class="font-medium text-surface-500 dark:text-surface-300">⚠️ Votre saisie de texte est limitée à {{ txtLimit }} caractères.</div>
          </div>
          <div class="flex-shrink-0 flex items-start gap-2">
            <TextSelector ref="textSelectorRef" @text-selected="onTextSelected" />

            <!-- SplitButton pour créer un nouveau texte avec différentes limites -->
            <SplitButton
              label="Nouveau (150)"
              icon="pi pi-plus"
              :model="splitButtonItems"
              @click="createNewText(150)"
              severity="success"
              size="small"
            />
          </div>
        </div>

        <TextInput :current-token="currentToken" @text-saved="onTextSaved" />
      </div>
      <div class="mt-4 text-sm text-surface-500 dark:text-surface-300">
        <a href="https://github.com/poledigital-isagri/Calibre" target="_blank" class="hover:underline">Code source</a> | CC0 - Pôle digital ISAGRI 2025 / sdegliame[at]isagri.fr
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getParam, setParam } from './utils/urlUtils';
import { useTextStorage } from './composables/useTextStorage';
import TextInput from './components/TextInput.vue';
import TextSelector from './components/TextSelector.vue';

const txtLimit = ref(parseInt(getParam('limite') || '150'));
const textSelectorRef = ref();
const { getOrCreateToken } = useTextStorage();

// Token actuel pour le TextInput
const currentToken = ref(getOrCreateToken());

// Configuration du SplitButton pour créer de nouveaux textes
const splitButtonItems = ref([
  {
    label: '300 caractères',
    icon: 'pi pi-file-edit',
    command: () => createNewText(300)
  },
  {
    label: '600 caractères',
    icon: 'pi pi-file-plus',
    command: () => createNewText(600)
  },
  {
    label: '1500 caractères',
    icon: 'pi pi-book',
    command: () => createNewText(1500)
  }
]);

// Watcher pour les changements de limite dans l'URL
watch(() => getParam('limite'), (newLimit) => {
  if (newLimit) {
    txtLimit.value = parseInt(newLimit);
  }
});

// Créer un nouveau texte avec une limite spécifique
const createNewText = (limite: number) => {
  // Générer un nouveau token
  const newToken = crypto.randomUUID();

  // Mettre à jour l'URL avec le nouveau token et la limite
  setParam('id', newToken);
  setParam('limite', limite.toString());

  // Mettre à jour la limite locale
  txtLimit.value = limite;

  // Sélectionner le nouveau token
  currentToken.value = newToken;

  // Rafraîchir la liste des textes
  if (textSelectorRef.value) {
    textSelectorRef.value.refreshTexts();
  }
};

// Gérer la sélection d'un texte depuis le sélecteur
const onTextSelected = (token: string) => {
  currentToken.value = token;
};

// Gérer la sauvegarde de texte pour rafraîchir la liste
const onTextSaved = (_token: string, _content: string) => {
  // Rafraîchir la liste des textes sauvegardés
  if (textSelectorRef.value) {
    textSelectorRef.value.refreshTexts();
  }
};
</script>
