import { getFirestore, doc, getDoc, addDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
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

    async getGoals(userid="User1") {
        const q = query(collection(db, 'goals'), where('userid', '==', userid));
        const querySnapshot = await getDocs(q);
        const goals = querySnapshot.docs.map(doc => doc.data());
        console.log(goals);
        return goals;
    }

    async syncGoals(userid="User1"){
        const q = query(collection(db, 'goals'), where('userid', '==', userid));
        const querySnapshot = await getDocs(q);
        const goals = querySnapshot.docs.map(doc => doc.data());
        console.log(goals);
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
    }

    async setDeleted(userid,id = 0){
        const q1 = query(collection(db, 'goals'), where('userid', '==', userid));
        const querySnapshot = await getDocs(q1);
        const goals = querySnapshot.docs.map(doc => ({ docid: doc.id, ...doc.data() }));

        let docID;
        let deletedFB;

        for(let e in goals){
            if (goals[e].id == id){
                console.log(goals[e]);
                deletedFB = goals[e].deleted;
                docID = goals[e].docid;
            }

        }
        const docRef = doc(db, 'goals', docID);

        await updateDoc(docRef, {
            deleted: !deletedFB
        });

        return !deletedFB

    }
}

export default new FireDataService();