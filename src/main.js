import { createApp } from 'vue';
import router from './router';
import './style.scss';
import App from './App.vue';

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

//importare l'icona
import {
    faUserPlus,
    faEnvelope,
    faLock,
    faSignInAlt,
    faCheckCircle,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Aggiungi le icone alla libreria
library.add(
    faUserPlus,
    faEnvelope,
    faLock,
    faSignInAlt,
    faCheckCircle,
    faExclamationTriangle
);


const app = createApp(App);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon); 
app.mount('#app');
