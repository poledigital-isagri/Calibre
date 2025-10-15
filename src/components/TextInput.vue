<!-- Composant principal de saisie de texte -->
<!-- sdegliame@isagri.fr | 20250424091736 -->

<template>
  <div>
    <Textarea
        v-model="text"
        :maxlength="txtLimite"
        :class="{'p-invalid': isOverLimit}"
        rows="6"
        class="w-full text-area"
        @input="onInput"
        :style="{ border: isOverLimit ? '4px solid red' : '' }"
    />

    <div class="flex justify-between mt-2 items-center">
      <div class="flex gap-4 items-center">
        <Indicator :current="text.length" :limit="txtLimite" />
        <span class="text-sm text-gray-600">(dont {{ nb_space }} espaces)</span>
      </div>
      <Button label="Copier le texte" icon="pi pi-copy" @click="copyToClipboard" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Indicator from './Indicator.vue';
import { useTextStorage } from '../composables/useTextStorage';
import { getParam, setParams } from '../utils/urlUtils';

// Définir les props
const props = defineProps<{
  currentToken?: string;
}>();

// Définir les événements émis
const emit = defineEmits<{
  textSaved: [token: string, content: string]
}>();

// détermination de la limite de caractères - reactive pour les changements d'URL
const txtLimite = ref(parseInt(getParam('limite') || '150'));
const { getStoredText, getStoredTextData, saveText, getOrCreateToken } = useTextStorage();

// Utiliser le token fourni en prop ou créer/récupérer depuis l'URL
const token = ref(props.currentToken || getOrCreateToken());
const text = ref(getStoredText(token.value));
const isOverLimit = computed(() => text.value.length >= txtLimite.value);
const nb_space = computed(() => (text.value.match(/\s/g) || []).length);

// Watcher pour les changements de token (quand un texte est sélectionné)
watch(() => props.currentToken, (newToken) => {
  if (newToken) {
    token.value = newToken;
    const textData = getStoredTextData(newToken);

    if (textData) {
      // Utiliser les données du localStorage (source de vérité)
      text.value = textData.content;
      txtLimite.value = textData.limite;
    } else {
      // Nouveau texte : utiliser la limite de l'URL ou la valeur par défaut
      text.value = '';
      txtLimite.value = parseInt(getParam('limite') || '150');
    }
  }
}, { immediate: true });

// sauvegarde du texte dans le localStorage à chaque changement de texte
watch(text, (val) => {
  if (val.length <= txtLimite.value) {
    saveText(token.value, val, txtLimite.value);
    if (val.length > 0) {
      setParams({
        id: token.value,
        limite: txtLimite.value.toString()
      });
    }
    // Émettre l'événement de sauvegarde
    emit('textSaved', token.value, val);
  }
});

// copie du texte dans le presse-papier
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(text.value);
  } catch (err) {
    console.error('Erreur lors de la copie', err);
  }
};

// limitation de la saisie du texte
const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  if (target.value.length > txtLimite.value) {
    target.value = target.value.slice(0, txtLimite.value);
  }
};
</script>

<style scoped>
.text-area {
  font-size: 1rem;
  font-family: consolas, monospace;
}
</style>
