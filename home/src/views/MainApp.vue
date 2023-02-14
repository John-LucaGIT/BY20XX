<template>
  <div class="app">
      <div class="goal-title">
        <h1>My goals for 20</h1><h1 id="yearxx" @keyup="validateYear" contenteditable="true">{{this.year}}</h1>
      </div>

      <div id="goal-list">
        <Goal @deleteFB="fireMethodDeleteHelper" :goalList="goalList"></Goal>
      </div>

      <div v-if="this.viewer == false" class="goal-wrapper">
            <div class="input-group bg-dark input-group-lg">
                <div class="bg-dark input-group-prepend">
                    <span class="text-light bg-dark input-group-text" id="inputGroup-sizing-lg">Enter Goal</span>
                </div>
                <input @click="toggleToast('init-info')" type="text" @keyup.lazy.enter="goalInput('goal')" id="goalInput" value="" class="text-light bg-dark form-control" aria-label="Enter Goal" aria-describedby="inputGroup-sizing-sm">
            </div>
      </div>

  </div>
</template>

<script>
  // @ is an alias to /src

  import { stringLiteral } from '@babel/types';
  import Goal from './Goal.vue';
  import { useToast } from "vue-toastification";

  export default {
    name: 'MainApp',
    components: {
      Goal,
    },
    setup() {
      // Get toast interface
      const toast = useToast();

      return { toast }
    },
    data() {
        return {
          goalList: [],
          gid: 0,
          status: false,
          year: '',
          viewer: null,
        };
    },
    created(){
      this.setViewer();
    },
    async mounted() {

      console.log('hello',this.hasSynced);
      if (!this.hasSynced) {
        console.log('syncing')
        await this.$emit('syncFB-goals');
        this.$store.commit('setHasSynced', true);
        console.log('current year',this.$store.getters.getYear)
      }

      if (this.$store) {
        this.updateGoalList;
        this.updateYear;
      }
      setTimeout(() => {
        this.setViewer();
        if (this.viewer == true) {
          let goals = this.$store.getters.getGoal;
          if (goals <= 0)
            this.toggleToast('no-goal');
        }
      }, 500)
    },
    methods:{
      goalInput(action) {
        if (document.getElementById('goalInput')) {
          this.goal = document.getElementById('goalInput').value;
          this.$store.commit('addGoal', {
            id: this.gid++,
            text: this.goal,
            status: this.status,
            deleted: false,
          });
          this.goalList = this.$store.getters.getGoal;

        }
        this.toggleToast('goal');
      },
      setViewer() {
        const id = new URL(location.href).searchParams.get('goal');
        if (id != null && id != '') {
          this.$store.commit('setViewState', true);
        }
        return this.viewer = this.$store.getters.getViewState;
      },
      toggleToast(toasti) {
        switch(toasti){
          case 'goal':
            if (!this.$store.getters.getToast['goal']){
              this.toast.success("You created your first goal! Click on overview to view and recover deleted goals.", {
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
              this.$store.commit('setToast','goal');
            }
            break;
          case 'init-info':
            if (!this.$store.getters.getToast['init-info']){
              this.toast.info("Click on a goal to delete it.", {
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
              this.$store.commit('setToast','init-info');
            }
            break;
          case 'viewer':
            if (this.viewer == true)
              if (!this.$store.getters.getToast['viewer']){
                this.toast.info("You are in viewer mode, your changes won't be saved.", {
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
                this.$store.commit('setToast','viewer');
              }
              break;
          case 'no-goal':
              if (!this.$store.getters.getToast['no-goal']){
                console.log('toast');
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
      },
      fireMethodDeleteHelper(payload) {
        this.$parent.fireMethodDelete(payload);
      },
      validateYear(event) {
        this.year = event.target.innerText;
        var re = /^\d{0,2}$/;
        if (!re.test(this.year)) {
          event.target.innerText = this.year.slice(0, -1);
          this.year = this.year.slice(0, -1);
        }
        console.log('setting new year');
        this.$store.commit('setYear', this.year );
      },

    },

    computed:{
      updateGoalList(){
        console.log('computed')
        this.year = this.$store.getters.getYear;
        return this.goalList = this.$store.getters.getGoal;
      },
      updateYear(){
        let fetchedYear = this.$store.getters.getYear;
        console.log('fetched',fetchedYear);
        if(fetchedYear == ''){
          fetchedYear = 'XX';
        }
        return this.year = fetchedYear;
      },
      hasSynced(){
        return this.$store.state.hasSynced
      },

    },
  }


</script>

<style scoped>

div.goal-title{
  margin-top: 0.4rem;
  margin-bottom: 2rem;
}
div.goal-wrapper{
    width: 50%;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    margin-top: 1rem;
    margin-bottom: 5rem;
}

input{
    text-align: center;
}

div.goal-title h1{
  display: inline;
}


</style>
