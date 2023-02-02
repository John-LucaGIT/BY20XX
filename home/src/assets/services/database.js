import { getFirestore, doc, getDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';



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

class FireDataService {
    getAll() {
        return db;
    }

    create(object) {
        return db.push(object);
    }

    update(key, value) {
        return db.child(key).update(value);
    }

    delete(key) {
        return db.child(key).remove();
    }

    deleteAll() {
        return db.remove();
    }
    async getGoalz() {
        const citiesCol = collection(db, 'goals');
        const citySnapshot = await getDocs(citiesCol);
        const cityList = citySnapshot.docs.map(doc => doc.data());
        console.log(cityList);
        return cityList;
    }

    addGoal() {
        addDoc(collection(db, 'goals'), {
            id: 1,
            text: "nadu",
            status: false,
            date: Date.now()
        });
    }
}

export default new FireDataService();