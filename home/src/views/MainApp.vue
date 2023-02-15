<template>
  <div class="app">
      <div class="goal-title">
        <h1>My goals for 20</h1><h1 id="yearxx" @keyup="validateYear" contenteditable="true">{{this.$store.getters.getYear || 'XX'}}</h1>
      </div>

      <div id="goal-list">
        <Goal @deleteFB="fireMethodDeleteHelper" :goalList="goalList"></Goal>
        <span class="error-message" v-if="error.goal">{{error.goal}}</span>
      </div>

      <div v-if="this.viewerValue == false || this.editValue" class="goal-wrapper">
            <div class="input-group bg-dark input-group-lg">
                <div class="bg-dark input-group-prepend" id="input-descrp-lnd">
                    <span class="text-light bg-dark input-group-text" id="inputGroup-sizing-lg">Enter Goal</span>
                </div>
                <input @click="toggleToast('init-info')" type="text" @keyup="forceGoalLength" @keyup.lazy.enter="goalInput('goal')" id="goalInput" value="" class="text-light bg-dark form-control" aria-label="Enter Goal" aria-describedby="inputGroup-sizing-sm">
                <button v-if="this.viewerValue == false || this.editValue" @click="this.$emit('saveGoalsHelper')" class="btn btn"><i class="fa-solid fa-floppy-disk"></i></button>
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
    props: {
      editValue: Boolean,
      viewerValue: Boolean,
    },
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
          error: [],
        };
    },
    created(){
      this.setViewer();
    },
    async mounted() {

      if (!this.hasSynced) {
        console.log('syncing')
        await this.$emit('syncFB-goals');
        this.$store.commit('setHasSynced', true);
      }

      if (this.$store) {
        await this.updateGoalList;
        await this.updateYear;
        await this.updateEdit;
      }
      setTimeout(() => {
        this.setViewer();
      }, 500)

    },
    methods:{
      goalInput(action) {
        if (document.getElementById('goalInput')) {
          this.goal = document.getElementById('goalInput').value;
          const goals = this.$store.getters.getGoal;
          if (goals.length > 0) {
            this.gid = goals[goals.length - 1].id + 1;
          } else {
            this.gid = 0;
          }
          if (this.validateGoal(this.goal)) {
            this.$store.commit('addGoal', {
              id: this.gid,
              text: this.goal,
              status: this.status,
              deleted: false,
            });
            this.goalList = this.$store.getters.getGoal;
          }
        }
        this.toggleToast('goal');
      },

      validateGoal(value){
        if (value.length > 50 || value.length < 3){
          this.error['goal'] = "Goal's must be between 3 and 50 characters!";
          return false;
        }
        var re = RegExp(/^[\w\s-]{0,50}$/);
        if (!re.test(value)) {
          this.error['goal'] = "Goal's may not contain special characters!";
          return false;
        }

        else{
          return true;
        }
      },
      forceGoalLength(event) {
        let goaltext = event.target.value;
        var re = RegExp(/^[\w\s-]{0,50}$/);
        if (!re.test(goaltext)) {
          event.target.value = goaltext.slice(0, -1);
          goaltext = goaltext.slice(0, -1);
          this.error['goal'] = "Goal's may not exceed 50 characters or contain special characters!";
        }else{
          this.error['goal'] = null;
        }
      },
      setViewer() {
        const id = new URL(location.href).searchParams.get('goal');
        if (id != null && id != '') {
          this.$store.commit('setViewState', true);
          this.$store.commit('setUserID',id);
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
        if(fetchedYear == ''){
          fetchedYear = 'XX';
        }
        return this.year = fetchedYear;
      },
      updateEdit(){
        this.$store.commit('setEdit',this.editValue)
      },
      hasSynced(){
        return this.$store.state.hasSynced
      },
      getEdit: {
        get () {
          return this.$store.state.getEdit
        },
        set () {
          this.$store.commit('setEdit')
        }
      }
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
    margin-bottom: 0.2rem;
}

input{
    text-align: center;
    border: none;
}


span.text-light.bg-dark.input-group-text{
  border: none;
}

span.text-light.bg-dark.input-group-text:focus{
  border: none;
  box-shadow: none;
}
.form-control:focus{
  box-shadow: none;
}

div.goal-title h1{
  display: inline;
}

/* Adjust the font size and line height for mobile devices */
@media (max-width: 480px) {
  form {
    font-size: 16px;
  }

  #input-descrp-lnd{
    display: none;
  }

  input, select, textarea {
    font-size: 16px;
    line-height: 1.5;
  }

  div.goal-wrapper{
    width: 80%;
  }
}

/* Reduce the width of the form elements on mobile devices */
@media (max-width: 576px) {
  input, select, textarea {
    width: 100%;
    max-width: 100%;
  }
}


.fa-floppy-disk{
  font-size: 1.4rem;
  color: white;
}

button.btn:focus,button.btn:active{
  box-shadow: none;
  border: none;
  outline: none;
  border-style: none;
}

button.btn:visited > .fa-floppy-disk{
  color: #42b983;
}

/* mouse over link */
button.btn:hover > .fa-floppy-disk {
  color: #42b983;
}

/* selected link */
button.btn:active > .fa-floppy-disk{
  color: #42b983;
}

</style>
