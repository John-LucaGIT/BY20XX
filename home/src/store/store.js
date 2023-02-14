import Vue from 'vue';
import Vuex from 'vuex';

// Create a new store instance.
export const store = new Vuex.Store({
    state: {
        goalList: [],
        year: '',
        list: 'goalList',
        userid: '',
        hasSynced: false,
        viewer: false,
        toast: JSON.parse(sessionStorage.getItem('toast')) || {},
    },
    actions: {
        loadToast({ state, commit }) {
            let toast = state.toast;
            if (!sessionStorage.getItem('toast')) {
                sessionStorage.setItem('toast', JSON.stringify(toast));
            } else {
                toast = JSON.parse(sessionStorage.getItem('toast'));
            }
            commit('setToast', toast);
        },
    },
    mutations: {
        addGoal(state, payload) {
            state.goalList.push(payload);
        },
        setYear(state, value) {
            state.year = value;
        },
        setUserID(state, id) {
            state.userid = id;
        },
        setList(state, payload) {
            state.list = payload;
        },
        setHasSynced(state, value) {
            state.hasSynced = value;
        },
        setToast(state, value) {
            state.toast[value] = true;
            sessionStorage.setItem('toast', JSON.stringify(state.toast));
        },
        setDeleted(state, gid) {
            for (let e in state.goalList) {
                if (state.goalList[e].id == gid) {
                    state.goalList[e].deleted = !state.goalList[e].deleted;
                    console.log(state.goalList);
                }
            }
        },
        setViewState(state,value){
            state.viewer = value;
        }
    },
    getters: {
        getState(state) {
            return state.count;
        },
        getGoal(state) {
            return state.goalList;
        },
        getYear(state) {
            return state.year;
        },
        getList(state) {
            return state.list;
        },
        getToast(state) {
            return state.toast;
        },
        getUserID(state) {
            return state.userid;
        },
        getViewState(state){
            return state.viewer;
        }
    },
});

