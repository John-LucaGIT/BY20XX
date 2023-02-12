<template>
  <div class="about">
    <h1>Goal Overview</h1>
  </div>

  <div class="deleted-goals">
    <h3>Deleted Goals</h3>
    <div id="deleted-goal-list">
        <Goal :goalList="goalList"></Goal>
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
      goalList: [],
      showDeletedGoals: true,
    }

  },
  mounted() {
    if (this.$store) {
      this.$store.commit('setList', 'deletedGoals');
      this.updateGoalList;
    }
  },
  methods:{
    updateShowDeleted() {
      this.showDeletedGoals = true;
    }
  },


  computed:{
    updateGoalList(){
      return this.goalList = this.$store.getters.getGoal;
    }
  },

}


</script>

<style>
div.deleted-goals{
  margin-top: 2rem;
}

</style>