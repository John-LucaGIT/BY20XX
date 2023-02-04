import { getFirestore, doc, getDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import {store} from '../../store/store';
store.getters.config
// => 'config'


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
    async getGoals() {
        const goalsCol = collection(db, 'goals');
        const goalSnapshot = await getDocs(goalsCol);
        const goals = goalSnapshot.docs.map(doc => doc.data());
        console.log(goals);
        return goals;
    }

    async syncGoals(){
        const goalsCol = collection(db, 'goals');
        const goalSnapshot = await getDocs(goalsCol);
        const goals = goalSnapshot.docs.map(doc => doc.data());
        for(let g in goals){
            store.commit('addGoal', {
                id: goals[g].id,
                text: goals[g].text,
                status: goals[g].status
            });
        }
    }

    addGoal(userid,id,text,status,deleted) {
        console.log(userid,id,text,status,deleted);
        addDoc(collection(db, 'goals'), {
            userid: userid,
            id: id,
            text: text,
            status: status,
            deleted: deleted,
            date: Date.now()
        });
        // store.state.deletedGoals = {id: id, text: text, status: status};

    }
}

export default new FireDataService();