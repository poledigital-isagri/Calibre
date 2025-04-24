<template>
  <main class="p-4">
    <div class="bg-surface-50 dark:bg-surface-950 p-10">
      <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
        <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-2">Saisie calibrée de texte</div>
        <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">⚠️ Votre saisie de texte est limitée à {{ txtLimit }} caractères.</div>
        <TextInput />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { getParam } from './utils/urlUtils';
import TextInput from './components/TextInput.vue';

const txtLimit = parseInt(getParam('limite') || '150');
</script>
