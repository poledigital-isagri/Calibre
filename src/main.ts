import { createApp } from 'vue';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Tooltip from 'primevue/tooltip';
import Dialog from 'primevue/dialog';
import SplitButton from 'primevue/splitbutton';

import "./style.css";
import "primeicons/primeicons.css";

// Migrer les anciennes données au démarrage
import { useTextStorage } from './composables/useTextStorage';
const { migrateOldData } = useTextStorage();
migrateOldData();

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.component('Textarea', Textarea);
app.component('Button', Button);
app.component('Select', Select);
app.component('Dialog', Dialog);
app.component('SplitButton', SplitButton);

app.directive('tooltip', Tooltip);

app.mount('#app');
