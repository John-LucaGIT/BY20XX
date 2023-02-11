<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/">Overview</router-link>
  </nav>
  <router-view/> -->
  <HomeView></HomeView>
  <button @click="getGoalsFB" class="btn btn-lg btn-warning">WHOW</button>
  <button @click="setDeletedFB" class="btn btn-lg btn-warning">QUERY</button>
  <button @click="saveGoalsFB" class="btn btn-lg btn-success">SAVE</button>
</template>

<script>
// @ is an alias to /src
import HomeView from './views/HomeView.vue';
import FireDataService from "./assets/services/database";
import { getGlobalThis } from '@vue/shared';
import { useToast } from "vue-toastification";


export default {
  name: 'App',
  components: {
    HomeView
  },
  methods:{
    addGoalFB(payload){
      FireDataService.addGoal(payload.userid, payload.id, payload.goal, payload.status, payload.deleted);
    },
    getGoalsFB(){
      FireDataService.getGoals();
    },
    syncGoalsFB(){
      FireDataService.syncGoals();
    },
    setDeletedFB(payload){
      FireDataService.setDeleted(payload);
    },
    saveGoalsFB(){
      let payload = this.$store.getters.getGoal;
      console.log(payload);
      FireDataService.saveGoals(payload);
    },

  },

}
</script>


<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Bungee+Hairline&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Bungee&family=Bungee+Hairline&display=swap');

#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: 'Bungee Hairline', cursive;
  font-family: 'Bungee', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-weight: bolder;
  color: #4b8ff4;

}
html ,#app{
  background-color: rgb(30, 30, 30);

}



nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #4b8ff4;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

