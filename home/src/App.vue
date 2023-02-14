<template>

  <HomeView @toastHelper="toggleToast"></HomeView>
  <button @click="setDeletedFB" class="btn btn-lg btn-warning">QUERY</button>
  <button v-if="viewer == false" @click="saveGoalsFB" class="btn btn-lg btn-success">SAVE</button>
  <button @click="clearSession" class="btn btn-lg btn-danger">CLEAR</button>

</template>

<script>
// @ is an alias to /src
import HomeView from './views/HomeView.vue';
import FireDataService from "./assets/services/database";
import { useToast } from "vue-toastification";

export default {
  name: 'App',
  components: {
    HomeView
  },
  setup() {
    // Get toast interface
    const toast = useToast();

    return { toast }
  },
  data(){
    return{
      userID: '',
      viewer: false,
    }
  },

  computed: {
    computedUserID() {
      const id = new URL(location.href).searchParams.get('goal');
      console.log(id);

      this.userID = id;
      this.$store.commit('setUserID',this.userID);
      if(id != null && id != ''){
        this.$store.commit('setViewState',true);
      }
      this.viewer = this.$store.getters.getViewState;

      return this.userID;
    },
  },
  methods:{
    addGoalFB(payload){
      FireDataService.addGoal(payload.userid, payload.id, payload.goal, payload.status, payload.deleted);
    },
    getGoalsFB(){
      FireDataService.getGoals();
    },
    async syncGoalsFB(){
      if(this.computedUserID && this.computedUserID != "" && this.computedUserID != null)
        await FireDataService.syncGoals(this.computedUserID);

      if (this.viewer)
        setTimeout(() => {
          let goals = this.$store.getters.getGoal;
          if (goals.length <= 0)
            this.toggleToast('no-goal');
        }, 500)
    },
    setDeletedFB(payload){
      FireDataService.setDeleted(payload);
    },
    saveGoalsFB(){
      let payload = this.$store.getters.getGoal;
      let additional = {year:false,password:false};
      additional.year = this.$store.getters.getYear;
      FireDataService.saveGoals(payload,additional);
    },
    clearSession(){
      sessionStorage.clear();
    },
    toggleToast(toasti) {
      switch (toasti) {
        case 'recover':
          if (!this.$store.getters.getToast['recover']) {
            this.toast.info("Click on a deleted goal to recover it.", {
              position: "top-right",
              timeout: 5000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
              draggable: true,
              draggablePercent: 0.6,
              showCloseButtonOnHover: false,
              closeButton: "button",
              icon: true,
              rtl: false
            });
            this.$store.commit('setToast', 'recover');
          }
        break;
        case 'no-goal':
          if (!this.$store.getters.getToast['no-goal']){
            this.toast.warning("The goal you are trying to view either does not exist or has been deleted.", {
              position: "top-right",
              timeout: 8000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
              draggable: true,
              draggablePercent: 0.6,
              showCloseButtonOnHover: false,
              closeButton: "button",
              icon: true,
              rtl: false
            });
            this.$store.commit('setToast','no-goal');

          }
        break;
      }
    }

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

