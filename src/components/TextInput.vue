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
import { getParam, setParam } from '../utils/urlUtils';

const txtLimite = parseInt(getParam('limite') || '200');
const { getStoredText, saveText, getOrCreateToken } = useTextStorage();

const token = getOrCreateToken();
const text = ref(getStoredText(token));
const isOverLimit = computed(() => text.value.length >= txtLimite);
const nb_space = computed(() => (text.value.match(/\s/g) || []).length);

watch(text, (val) => {
  if (val.length <= txtLimite) {
    saveText(token, val);
    if (val.length > 0) setParam('id', token);
  }
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(text.value);
  } catch (err) {
    console.error('Erreur lors de la copie', err);
  }
};

const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  if (target.value.length > txtLimite) {
    target.value = target.value.slice(0, txtLimite);
  }
};
</script>

<style scoped>
.text-area {
  font-size: 1rem;
  font-family: consolas, monospace;
}
</style>
