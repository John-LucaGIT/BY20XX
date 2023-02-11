import Vue from 'vue';
import Vuex from 'vuex';

// Create a new store instance.
export const store = new Vuex.Store({
  state:{
    goalList: [],
    year: 'XX',
    list: 'goalList',
    hasSynced: false,
    toast: {},
  },
  mutations: {
    addGoal(state, payload){
      state.goalList.push(payload);
    },
    setYear(state, payload){
      state.year = payload;
    },
    setList(state,payload){
      state.list = payload;
    },
    setHasSynced(state, value){
      state.hasSynced = value;
    },
    setToast(state,value){
      state.toast[value] = true;
    },
    setDeleted(state, gid){
      for(let e in state.goalList){
        if (state.goalList[e].id == gid){
          state.goalList[e].deleted = !state.goalList[e].deleted;
          console.log(state.goalList);
        }
      }
    }

  },
  getters:{
    getState(state){
      return state.count;
    },
    getGoal(state){
      return state.goalList;
    },
    getYear(state){
      return state.year;
    },
    getList(state){
      return state.list;
    },
    getToast(state){
      return state.toast;
    }
  },
})

