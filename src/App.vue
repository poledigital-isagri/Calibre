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
          <div class="flex-shrink-0">
            <TextSelector ref="textSelectorRef" @text-selected="onTextSelected" />
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
import { ref } from 'vue';
import { getParam } from './utils/urlUtils';
import { useTextStorage } from './composables/useTextStorage';
import TextInput from './components/TextInput.vue';
import TextSelector from './components/TextSelector.vue';

const txtLimit = parseInt(getParam('limite') || '150');
const textSelectorRef = ref();
const { getOrCreateToken } = useTextStorage();

// Token actuel pour le TextInput
const currentToken = ref(getOrCreateToken());

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
