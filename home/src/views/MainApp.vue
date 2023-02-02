<template>
  <div class="app">
      <div class="goal-title">
        <h1>My goals for 20</h1><h1 id="yearxx" @keyup="validateYear" contenteditable="true">{{this.year}}</h1>
      </div>

      <div id="goal-list">
        <Goal :goalList="goalList"></Goal>

      </div>


      <div class="goal-wrapper">
            <div class="input-group bg-dark input-group-lg">
                <div class="bg-dark input-group-prepend">
                    <span class="text-light bg-dark input-group-text" id="inputGroup-sizing-lg">Enter Goal</span>
                </div>
                <input type="text" @keyup.lazy.enter="goalInput('goal')" id="goalInput" value="" class="text-light bg-dark form-control" aria-label="Enter Goal" aria-describedby="inputGroup-sizing-sm">
            </div>
      </div>

  </div>
</template>

<script>
  // @ is an alias to /src

  import { stringLiteral } from '@babel/types';
  import Goal from './Goal.vue';

  export default {
    name: 'MainApp',
    components: {
      Goal,
    },
    data() {
        return {
          goalList: [],
          gid: 1,
          status: false,
          year: 'XX',
        };
    },
    mounted() {
      if (this.$store) {
        this.updateGoalList;
        this.updateYear;
      }
    },

    methods:{
      goalInput(action) {
        if (document.getElementById('goalInput')){
            this.goal = document.getElementById('goalInput').value;
            this.$store.commit('addGoal', {
              id: this.gid++,
              text: this.goal,
              status: this.status
            });
            this.goalList = this.$store.getters.getGoal
        }
      },

      validateYear(event) {
        this.year = event.target.innerText;
        var re = /^\d{0,2}$/;
        if (!re.test(this.year)) {
          event.target.innerText = this.year.slice(0, -1);
          this.year = this.year.slice(0, -1);
        }
        this.$store.commit('setYear',{year: this.year});
      },

    },
    computed:{
      updateGoalList(){
        console.log('computed')
        return this.goalList = this.$store.getters.getGoal;
      },
      updateYear(){
        let fetchedYear = this.$store.getters.getYear.year;
        if(fetchedYear == ''){
          fetchedYear = 'XX';
        }
        return this.year = fetchedYear;
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
