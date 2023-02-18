<template>
  <div class="home">
    <nav>
      <a id="home" @click="changePage('home')" >Home</a> |
      <a id="overview" @click="changePage('overview')" >Overview</a>
    </nav>
    <a href="/">
      <img class="lnd-logo" alt="By20XX logo" src="../assets/by20xx.png">
    </a>
    <MainApp @pw-off="togglePWField" :viewerValue="viewerValue" :editValue="editValue" @saveGoalsHelper="fireMethodSave" @deleteFB="fireMethodDelete" @syncFB-goals="fireMethodGet" @goal-emit="fireMethod" v-if="page == 'home'"></MainApp>
    <GoalOverview v-if="page == 'overview'"></GoalOverview>
    <Password ref="pw" v-if="this.$store.getters.getPassword || this.$store.getters.getViewState == false" @passwordHelper="setParentPasswd"></Password>

  </div>
</template>

<script>
// @ is an alias to /src
import MainApp from './MainApp.vue';
import GoalOverview from './GoalOverview.vue';
import Password from './Password.vue';


export default {
  name: 'HomeView',
  props: {
    editValue: Boolean,
    viewerValue: Boolean,
  },
  components: {
    MainApp,
    GoalOverview,
    Password
  },
  data(){
    return{
      page: 'home',
      publicPath: process.env.BASE_URL,
      touchStartX: 0,
      touchEndX: 0,
      touchMoveThreshold: 40,
    }
  },
  mounted(){
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
  },
  beforeDestroy() {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  },
  methods:{
    isMobile(){
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
    },
    handleTouchMove(event) {
      if (!this.isMobile()) {
          return;
      }

      this.touchEndX = event.touches[0].clientX;

      if (this.touchStartX - this.touchEndX > this.touchMoveThreshold) {
        this.changePage('overview');
      }
      if (this.touchEndX - this.touchStartX > this.touchMoveThreshold) {
        this.changePage('home');
      }
    },
    async fireMethod(payload){
      this.$parent.addGoalFB(payload);
    },
    async fireMethodGet(){
      await this.$parent.syncGoalsFB();
    },
    async fireMethodDelete(payload){
      this.$parent.setDeletedFB(payload);
    },
    async fireMethodSave(){
      this.$parent.saveGoalsFB();
    },
    async setParentPasswd(value,isviewer){
      this.$parent.setPassword(value,isviewer);
    },
    togglePWField(){
      this.$refs.pw.changeActiveState();

    },
    changePage(setting){
      switch(setting){
        case 'home':
          document.getElementById(setting).style.color='#42b983';
          document.getElementById('overview').style.color='#4b8ff4';
          break;
        case 'overview':
          this.$emit('toastHelper','recover');
          document.getElementById(setting).style.color='#42b983';
          document.getElementById('home').style.color='#4b8ff4';
          break;
      }
      this.page = setting;
    },
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


  /* Logo styles for mobile devices */
  @media (max-width: 767px) {
    .lnd-logo {
      width: 250px; /* adjust to the desired size */
      height: auto;
    }
  }

</style>


