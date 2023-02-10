import Vue from 'vue';
import Vuex from 'vuex';

// Create a new store instance.
export const store = new Vuex.Store({
  state:{
    count: 0,
    goalList: [],
    deletedGoals:[],
    year: 'XX',
    list: 'goalList',
    hasSynced: false
  },
  mutations: {
    addGoal(state, payload){
      state.goalList.push(payload);
    },
    setYear(state, payload){
      state.year = payload;
    },
    addDeletedGoal(state, payload){
      state.deletedGoals.push(payload);
    },
    setList(state,payload){
      state.list = payload;
    },
    setHasSynced(state, value){
      state.hasSynced = value
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
    getDeletedGoal(state){
      return state.deletedGoals;
    },
    getList(state){
      return state.list;
    }
  },
})
store.commit('increment')

console.log(store.state.count) // -> 1

