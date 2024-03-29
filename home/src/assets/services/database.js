import { getFirestore, doc, setDoc, getDoc, addDoc, updateDoc, writeBatch, collection, getDocs, query, where } from 'firebase/firestore';
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeApp } from 'firebase/app';
import {store} from '../../store/store';
import router from '../../router/index';
import bcrypt from 'bcryptjs';


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
const analytics = getAnalytics(app);

function bcompare(password, hashedPassword){
    return new Promise((resolve, reject) => {

        bcrypt.compare(password, hashedPassword,
            async function (err, isMatch) {

            // Comparing the original password to
            // encrypted password
            if (isMatch) {
                resolve(true);
                logEvent(analytics, 'logins', { loginSuccess: true});
            }

            if (!isMatch) {
                // If password doesn't match the following
                // message will be sent
                resolve(false);
                logEvent(analytics, 'incorrect_logins', { loginFailed: true});
            }

            if (err) {
                reject(err);
            }
        })
    })
}



const validateGoal = (goal) => {
    const regex = /^[a-zA-Z0-9<> ]{1,50}$/; // only allows alphabets and spaces, up to 50 characters
    if(regex.test(goal)){
        return goal;
    }
}

const validateYear = (year) => {
    if(year == false){
        return false;
    }
    const regex = /^[0-9]{2}$/; // only allows integers, exactly 2 characters
    if(regex.test(year)){
        return year;
    }
}


class FireDataService {

    async syncGoals(userid){
        const userRef = doc(collection(db, "users"), userid);
        const goalRef = collection(userRef, "goals");
        const querySnapshot = await getDocs(goalRef);
        const goals = querySnapshot.docs.map(doc => doc.data());

        try {
            const userDocRef = doc(db, "users", userRef.id); // Construct a DocumentReference to the user's document
            const userDocSnapshot = await getDoc(userDocRef); // Retrieve the user's document
            const additionalData = userDocSnapshot.data(); // Get the additional data from the document
            if (additionalData){
                if (additionalData.year && additionalData.year != ""){
                    store.commit('setYear', additionalData.year);
                }

                if (additionalData.password && additionalData.password != ""){
                    store.commit('setPasswd', additionalData.password);
                }

                if (additionalData.locked){
                    store.commit('setLocked',additionalData.locked);
                }
            }
        } catch (e) {
            console.error("Error retrieving user document: ", e);
        }

        for(let g in goals){
            store.commit('addGoal', {
                id: goals[g].id,
                text: goals[g].text,
                status: goals[g].status,
                deleted: goals[g].deleted
            });
        }
        logEvent(analytics, 'synced_goals', { synced: true});
    }



    async saveGoals(goals,additional=false){

        let userRef = null;
        const locked = store.getters.getLocked;

        const batch = writeBatch(db);

        if(additional.userid && additional.userid != ""){
            userRef = doc(collection(db, "users"),additional.userid);
            const oldGoalRef = collection(userRef, "goals");
            const batch = writeBatch(db);

            const goalsDocs = await getDocs(oldGoalRef);
            goalsDocs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }else{
            userRef = doc(collection(db, "users"));
        }

        if(goals.length > 0){
            goals.forEach(goal => {
                const goalRef = doc(collection(userRef, "goals"));
                batch.set(goalRef, {
                    id: goal.id,
                    text: validateGoal(goal.text),
                    status: goal.status,
                    deleted: goal.deleted,
                    date: Date.now()
                });
              });
              await batch.commit();

            if(additional)
              if(additional.year && additional.year != "XX" && additional.year != "" || additional.password && additional.password != ""){
                if(!additional.year){
                    additional.year = false;
                }
                if(!additional.password){
                    additional.password = false;
                }else{
                    store.commit.setPasswd = true;
                    logEvent(analytics, 'goals_with_password', { hasPassword: true});
                }
                try {
                    const userDocRef = doc(db, "users", userRef.id); // Construct a DocumentReference to the user's document
                    const docRef = await setDoc(userDocRef, {
                        year: validateYear(additional.year),
                        password: additional.password,
                        locked: locked,
                    });
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
              }

            router.push({ path: '/', query: { goal: userRef.id } });
            logEvent(analytics, 'goals_saved', { goals: goals.length});

            return userRef.id;
        }
    }

    async unlockGoal(passwd){
        try {
            const userid = store.getters.getUserID;
            const userRef = doc(collection(db, "users"), userid);
            const userDocRef = doc(db, "users", userRef.id); // Construct a DocumentReference to the user's document
            const userDocSnapshot = await getDoc(userDocRef); // Retrieve the user's document
            const additionalData = userDocSnapshot.data(); // Get the additional data from the document
            if (additionalData && additionalData.password != false && additionalData.password != ""){
                return bcompare(passwd,additionalData.password);
            }
        } catch (e) {
            console.error("Error retrieving user document: ", e);
        }
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