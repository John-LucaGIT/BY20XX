<template>
  <div class="home">
    <nav>
      <a id="home" @click="changePage('home')" >Home</a> |
      <a id="overview" @click="changePage('overview')" >Overview</a>
    </nav>
    <img class="lnd-logo" alt="By20XX logo" src="../assets/by20xx.png">
    <MainApp v-if="page == 'home'"></MainApp>
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

</style>


