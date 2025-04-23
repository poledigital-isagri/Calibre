import { createApp } from 'vue';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

import "./style.css";
import "primeicons/primeicons.css";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.component('Textarea', Textarea);
app.component('Button', Button);

app.mount('#app');
