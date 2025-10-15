<!-- Composant de sélection des textes sauvegardés -->
<!-- sdegliame@isagri.fr | 20250115 -->

<template>
  <div class="text-selector">
    <Select
      v-model="selectedText"
      :options="storedTexts"
      optionLabel="preview"
      optionValue="token"
      placeholder="Sélectionner un texte sauvegardé"
      class="w-full md:w-80"
      @change="onTextSelected"
      :disabled="storedTexts.length === 0"
      filter
      filterPlaceholder="Rechercher..."
    >
      <template #option="slotProps">
        <div class="flex justify-between items-start w-full">
          <div class="flex flex-col flex-1 min-w-0">
            <span class="font-medium truncate">{{ slotProps.option.preview }}</span>
            <small class="text-gray-500">
              {{ slotProps.option.content.length }} caractères
            </small>
          </div>
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            size="small"
            class="ml-2 flex-shrink-0"
            @click.stop="deleteText(slotProps.option.token)"
            v-tooltip="'Supprimer ce texte'"
          />
        </div>
      </template>
    </Select>
    
    <div v-if="storedTexts.length === 0" class="text-sm text-gray-500 mt-1">
      Aucun texte sauvegardé
    </div>
    
    <div v-else class="text-sm text-gray-500 mt-1">
      {{ storedTexts.length }} texte(s) sauvegardé(s)
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTextStorage, type StoredText } from '../composables/useTextStorage';
import { setParam } from '../utils/urlUtils';

const { getAllStoredTexts, getOrCreateToken, deleteStoredText } = useTextStorage();

const selectedText = ref<string>('');
const storedTexts = ref<StoredText[]>([]);

// Charger les textes sauvegardés
const loadStoredTexts = () => {
  storedTexts.value = getAllStoredTexts();
};

// Définir les événements émis
const emit = defineEmits<{
  textSelected: [token: string]
}>();

// Gérer la sélection d'un texte
const onTextSelected = () => {
  // Cette fonction est appelée par l'événement @change, mais on utilise le watcher ci-dessous
};

// Watcher pour détecter les changements de sélection
watch(selectedText, (newToken) => {
  if (newToken && typeof newToken === 'string') {
    // Mettre à jour l'URL avec le token sélectionné
    setParam('id', newToken);
    // Émettre l'événement pour informer le parent
    emit('textSelected', newToken);
  }
});

// Supprimer un texte
const deleteText = (token: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce texte ?')) {
    deleteStoredText(token);
    loadStoredTexts();

    // Si le texte supprimé était le texte actuel, créer un nouveau token et l'émettre
    const currentToken = getOrCreateToken();
    if (currentToken === token) {
      // Supprimer le paramètre id de l'URL
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.replaceState(null, '', url.toString());

      // Créer un nouveau token et l'émettre
      const newToken = crypto.randomUUID();
      emit('textSelected', newToken);
      selectedText.value = newToken;
    }
  }
};

// Charger les textes au montage du composant
onMounted(() => {
  loadStoredTexts();
  updateSelectedText();
});

// Mettre à jour le texte sélectionné
const updateSelectedText = () => {
  const currentToken = getOrCreateToken();
  selectedText.value = currentToken;
};

// Exposer des méthodes pour le parent
defineExpose({
  refreshTexts: loadStoredTexts,
  updateSelectedText
});
</script>

<style scoped>
.text-selector {
  min-width: 200px;
}
</style>
