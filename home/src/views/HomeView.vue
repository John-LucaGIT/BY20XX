<template>
  <div class="home">
    <nav>
      <a id="home" @click="changePage('home')" >Home</a> |
      <a id="overview" @click="changePage('overview')" >Overview</a>
    </nav>
    <img class="lnd-logo" alt="By20XX logo" src="../assets/by20xx.png">
    <MainApp @deleteFB="fireMethodDelete" @syncFB-goals="fireMethodGet" @goal-emit="fireMethod" v-if="page == 'home'"></MainApp>
    <GoalOverview v-if="page == 'overview'"></GoalOverview>
  </div>
</template>

<script>
// @ is an alias to /src
import MainApp from './MainApp.vue';
import GoalOverview from './GoalOverview.vue';

export default {
  name: 'HomeView',
  components: {
    MainApp,
    GoalOverview,
  },
  data(){
    return{
      page: 'home',
      publicPath: process.env.BASE_URL
    }
  },

  methods:{
    fireMethod(payload){
      this.$parent.addGoalFB(payload);
    },
    fireMethodGet(){
      this.$parent.syncGoalsFB();
    },
    fireMethodDelete(payload){
      this.$parent.setDeletedFB(payload);
    },
    changePage(setting){
      switch(setting){
        case 'home':
          document.getElementById(setting).style.color='#42b983';
          document.getElementById('overview').style.color='#4b8ff4';
          break;
        case 'overview':
          document.getElementById(setting).style.color='#42b983';
          document.getElementById('home').style.color='#4b8ff4';
          break;
      }
      this.page = setting;
    }
  },
}
</script>

<style>
  nav a:hover{
    text-decoration: underline;
    cursor: pointer;
  }
  a#home{
    color: #42b983
  }

  .lnd-logo{
    width: 25%;
  }

  img{
    filter: drop-shadow(16px 8px 16px black);
  }


</style>


