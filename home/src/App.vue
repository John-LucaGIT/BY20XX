<template>

  <HomeView :viewerValue="viewer" :editValue="edit" @toastHelper="toggleToast"></HomeView>

  <!-- <button @click="clearSession" class="btn btn-lg btn-danger">CLEAR</button> -->

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
      password: false,
      edit: false,
    }
  },
  mounted(){
    document.title = 'BY20XX';
  },
  computed: {
    computedUserID() {
      const id = new URL(location.href).searchParams.get('goal');
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
    async saveGoalsFB(){
      let payload = this.$store.getters.getGoal;
      let additional = {year:false,password:false};
      additional.userid = this.userID;
      additional.year = this.$store.getters.getYear;
      additional.password = this.password;
      if(payload && payload.length > 0){
        let userid = await FireDataService.saveGoals(payload,additional);
        this.toggleToast('goal-set');
        this.viewer = true;
        this.$store.commit('setViewState',true);
        setTimeout(() => {
          try{
            navigator.clipboard.writeText(`https://BY20XX.com/?goal=${userid}`);
            this.toggleToast('clipboard');
          }catch(err){
            console.log("Error Clipboard Copy not Supported on IOS: "+err);
          }
        }, 500)
      }

    },
    async setPassword(passw,isviewer){
      if(isviewer){
        let auth = await FireDataService.unlockGoal(passw);
        if(auth){
          this.toggleToast('password-unlocked');
          this.$store.commit('setEdit',auth);
          this.$store.commit('setLocked',false);
          this.edit = auth;
        }
      }else{
        this.password = await passw;
        this.toggleToast('password-set');
      }
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
        break;
        case 'password-set':
          if (!this.$store.getters.getToast['password-set']){
            this.toast.success("Use it to edit your goals later.", {
              position: "top-right",
              timeout: 10000,
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
            this.$store.commit('setToast','password-set');
          }
          this.toast.success("Password set!", {
              position: "top-right",
              timeout: 6000,
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
        break;
        case 'password-unlocked':
          this.toast.success("You have successfully unlocked your goal for editing!", {
            position: "top-right",
            timeout: 10000,
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
        break;
        case 'goal-set':
          this.toast.success("You have successfully saved your goal. Share it using the page link!", {
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
        break;
        case 'clipboard':
          this.toast.success("Shareable URL copied to clipboard!", {
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
  font-family: 'Bungee Hairline', Arial, Helvetica, sans-serif;
  font-family: 'Bungee', Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-weight: bolder;
  color: #4b8ff4;
}
html, #app{
  background-color: rgb(30, 30, 30);
}

body{
  background-color: #42b983;
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

@media (max-width: 480px) {
  #app {
    padding-left: 2%;
    padding-right: 2%;
  }
}

.error-message{
    font-family: 'Courier New', Courier, monospace;
    color: red;
}

</style>

