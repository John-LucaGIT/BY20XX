import { getFirestore, doc, getDoc, addDoc, updateDoc, writeBatch, collection, getDocs, query, where } from 'firebase/firestore';
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
        const userRef = doc(collection(db, "users"), userid);
        const goalRef = collection(userRef, "goals");
        const querySnapshot = await getDocs(goalRef);
        const goals = querySnapshot.docs.map(doc => doc.data());
        console.log(goals);
        return goals;
    }

    async syncGoals(userid="User1"){
        const userRef = doc(collection(db, "users"), userid);
        const goalRef = collection(userRef, "goals");
        const querySnapshot = await getDocs(goalRef);
        const goals = querySnapshot.docs.map(doc => doc.data());
        console.log(goals);
        for(let g in goals){
            store.commit('addGoal', {
                userid: goals[g].userid,
                id: goals[g].id,
                text: goals[g].text,
                status: goals[g].status,
                deleted: goals[g].deleted
            });
        }
    }

    async saveGoals(goals){
        const batch = writeBatch(db);

        goals.forEach(goal => {
            const userRef = doc(collection(db, "users"), goal.userid);
            const goalRef = doc(collection(userRef, "goals"));
            batch.set(goalRef, {
              id: goal.id,
              text: goal.text,
              status: goal.status,
              deleted: goal.deleted,
              date: Date.now()
            });
          });
          await batch.commit();

    }


    async setDeleted(payload){
        let userid = payload.userid;
        let gid = payload.gid;
        const userRef = doc(collection(db, "users"), userid);
        const goalRef = collection(userRef, "goals");
        const querySnapshot = await getDocs(goalRef);
        const goals = querySnapshot.docs.map(doc => doc.data());

        // const q1 = query(collection(db, 'goals'), where('userid', '==', userid));
        // const querySnapshot = await getDocs(q1);
        // const goals = querySnapshot.docs.map(doc => ({ docid: doc.id, ...doc.data() }));

        let docID;
        let deletedFB;

        for(let e in goals){
            if (goals[e].id == gid){
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

    async setAdditional(payload){
        let passwd = payload.password;
    }
}

export default new FireDataService();