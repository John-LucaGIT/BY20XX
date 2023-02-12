<template>
    <div class="goal">
        <div class="scrollable">
            <ul>
                <div class="container">
                    <div v-for="goalList in listToShow">
                        <div class="row d-flex align-items-center">
                            <div class="col col-lg text-right" style="margin-left:2rem">
                                <div class="row d-flex justify-content-end">
                                    <h3 @click="deleteGoal(goalList.id)" :id="'goal'+goalList.id" :key="goalList.id" :class="{ 'completed': goalList.status }">
                                        {{goalList.text}}
                                    </h3>
                                </div>
                            </div>
                            <div class="col col-sm text-center">
                                <i v-if="showDeletedGoals === false" @click="toggleGoal(goalList.id)" :id="'check'+goalList.id" :key="goalList.id" :class="{ 'fa-solid fa-check' : goalList.status == false, 'fa-solid fa-times' : goalList.status}"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </ul>
        </div>

    </div>
</template>

<script>

  export default {
    name: 'Goal',
    data() {
        return {
            showDeletedGoals: false,
        };
    },
    mounted() {
        if (this.$store) {
            this.updateDeletedGoalList;
            this.$store.commit('setList', 'goalList');
        }
    },
    methods:{
        deleteGoal(gid){
            if(!this.showDeletedGoals)
                this.$parent.toggleToast('viewer');
            console.log('calling delete');
            this.$store.commit('setDeleted',gid);
        },
        toggleGoal(gid){
            this.$parent.toggleToast('viewer');
            for(let e = 0; e < this.goalList.length; e++){
                if(this.goalList[e].id == gid){
                    this.goalList[e].status = !this.goalList[e].status;
                }
            }
        },
    },
    props: {
        goalList: Array,
    },
    computed:{
        updateDeletedGoalList(){
            console.log('computed')
            return this.deletedGoals = this.$store.getters.getDeletedGoal;
        },
        listToShow(){
            let list = this.$store.getters.getList;
            if(list == 'goalList'){
                this.showDeletedGoals = false;
                return this.goalList.filter(goal => goal.deleted === false);
            }else{
                this.showDeletedGoals = true;
                return this.goalList.filter(goal => goal.deleted === true);
            }
        }
    }

  }
</script>

<style scoped>

h3{
    width: fit-content;
    display: block;
}

h3:hover{
    text-decoration: underline;
    cursor: pointer;
}

i.fa-solid{
    font-size: 1.5rem;
    margin-bottom: 0.7rem;
}
.fa-check:hover {
    content: "";
    display: inline-block;
    border-radius: 50%;
    background-color: #42b983;
    text-align: center;
    vertical-align: middle;
    padding: 0.05rem;
}

.fa-times:hover {
    content: "";
    display: inline-block;
    border-radius: 50%;
    background-color: #b94246;
    text-align: center;
    vertical-align: middle;
    padding: 0.05rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
}

.scrollable{
    overflow: auto;
    height: 25rem;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollable::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollable {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

h3.completed{
    text-decoration: line-through;
    color: #42b983;
}
</style>