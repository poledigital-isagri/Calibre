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
              {{ slotProps.option.content.length }}/{{ slotProps.option.limite }} caractères
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

    <!-- Dialog de confirmation de suppression -->
    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="Confirmer la suppression"
      :style="{ width: '25rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="flex align-items-center gap-3 mb-3">
        <i class="pi pi-exclamation-triangle text-orange-500" style="font-size: 2rem"></i>
        <div>
          <p class="mb-2">Êtes-vous sûr de vouloir supprimer ce texte ?</p>
          <p class="text-sm text-gray-600 mb-0">
            <strong>Aperçu :</strong> {{ textToDelete?.preview }}
          </p>
          <p class="text-sm text-gray-600 mb-0">
            <strong>Taille :</strong> {{ textToDelete?.content.length }}/{{ textToDelete?.limite }} caractères
          </p>
        </div>
      </div>

      <template #footer>
        <Button
          label="Annuler"
          icon="pi pi-times"
          @click="cancelDelete"
          text
        />
        <Button
          label="Supprimer"
          icon="pi pi-trash"
          @click="confirmDelete"
          severity="danger"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTextStorage, type StoredText } from '../composables/useTextStorage';
import { setParam } from '../utils/urlUtils';

const { getAllStoredTexts, getOrCreateToken, deleteStoredText, getStoredLimit } = useTextStorage();

const selectedText = ref<string>('');
const storedTexts = ref<StoredText[]>([]);

// État pour le dialog de suppression
const showDeleteDialog = ref(false);
const textToDelete = ref<StoredText | null>(null);

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
    // Récupérer la limite associée à ce token
    const limite = getStoredLimit(newToken);

    // Mettre à jour l'URL avec le token sélectionné et sa limite
    setParam('id', newToken);
    setParam('limite', limite.toString());

    // Émettre l'événement pour informer le parent
    emit('textSelected', newToken);
  }
});

// Supprimer un texte - afficher le dialog de confirmation
const deleteText = (token: string) => {
  // Trouver le texte à supprimer pour l'afficher dans le dialog
  const textData = storedTexts.value.find(text => text.token === token);
  if (textData) {
    textToDelete.value = textData;
    showDeleteDialog.value = true;
  }
};

// Confirmer la suppression
const confirmDelete = () => {
  if (textToDelete.value) {
    const token = textToDelete.value.token;
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

  // Fermer le dialog
  showDeleteDialog.value = false;
  textToDelete.value = null;
};

// Annuler la suppression
const cancelDelete = () => {
  showDeleteDialog.value = false;
  textToDelete.value = null;
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
