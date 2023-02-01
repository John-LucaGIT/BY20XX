<template>
  <div class="about">
    <h1>Goal Overview</h1>
  </div>

  <div class="deleted-goals">
    <h3 @click="checkThing()">Deleted Goals</h3>
    <div id="deleted-goal-list">
        <Goal :deletedGoals="deletedGoals"></Goal>
    </div>
  </div>

</template>

<script>
import Goal from './Goal.vue';

export default {
  name: 'GoalOverview',
  components: {
    Goal,
  },

  data(){
    return{
      deletedGoals: [],
      showDeletedGoals: true,
    }

  },
  mounted() {
    if (this.$store) {
      this.updateDeletedGoalList;
      this.$store.commit('setList', 'deletedGoals');
      this.showDeletedGoals = true;
    }
  },
  methods:{
    checkThing(){
      console.log(this.deletedGoals);

    },
    updateShowDeleted() {
      this.showDeletedGoals = true;
    }
  },


  computed:{
    updateDeletedGoalList(){
        console.log('computed Goals:')
        console.log(this.$store.getters.getDeletedGoal)
        return this.deletedGoals = this.$store.getters.getDeletedGoal;

    },
  },

}


</script>

<style>
div.deleted-goals{
  margin-top: 2rem;
}

</style>