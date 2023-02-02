import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {store} from './store/store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { initializeApp } from 'firebase/app';
// import firebase from "firebase";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';



var firebaseConfig = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_APP_ID,
    measurementId: process.env.VUE_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Get a list of cities from your database
getGoalz(db)
async function getGoalz(db) {
    const citiesCol = collection(db, 'goals');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    console.log(cityList);
    return cityList;
}


createApp(App).use(store).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')

export {
    db
}