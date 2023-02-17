<template>
    <div class="pulsate text" @click="handleClick">
        <span>{{ message }}</span>
        <span class="pulsate"></span>
    </div>
    <div class="input-group bg-dark input-group-lg">
        <div class="password-input" :class="{ 'active': isActive, inputBoxUp : flag }">
            <div class="message" v-if="!isPasswordSet">
                <div class="slider" v-if="isActive" ref="slider"></div>
            </div>
            <form @submit.prevent="submitForm">
                <p class="error-message">{{ error }}</p>
                <input class="input-bx msgara" @blur="flag=false,isActive=false"  @focus="flag=true" @click="setClicked" type="password" v-model="password" v-if="isActive" placeholder="Enter password">
            </form>
        </div>
    </div>
</template>

<script>
import bcrypt from 'bcryptjs';

export default {
    name: 'Password',
    emits: ['passwordHelper'],
    props:{
        togglePWInput: Boolean
    },
    data() {
        return {
            isActive: false,
            isDragging: false,
            startX: 0,
            password: '',
            isPasswordSet: false,
            message: 'Swipe up to set password',
            error: '',
            flag: false,
            touchStartY: 0,
            touchEndY: 0,
            touchMoveThreshold: 1,
        };
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('touchstart', this.handleTouchStart);
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.handleTouchEnd);
        window.addEventListener('keydown', this.onKeyDown);

        if(this.isMobile()){
            this.message = 'Swipe up or tap to set password';
        }else{
            this.message = 'Click to set password';
        }
        if(this.$store.getters.getViewState){
            if(this.isMobile()){
                this.message = 'Swipe up to enter password';
            }else{
                this.message = 'Click to enter password';
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleTouchEnd);
    },
    methods: {
        changeActiveState(){
            this.isActive = !this.isActive;
        },
        handleTouchStart(event) {
            this.touchStartY = event.touches[0].clientY;
        },
        handleTouchMove(event) {
            if (!this.isMobile()) {
                return;
            }

            this.touchEndY = event.touches[0].clientY;

            if (this.touchStartY - this.touchEndY > this.touchMoveThreshold && !this.isPasswordSet) {
                this.isActive = true;

            }
            if (this.touchEndY - this.touchStartY > this.touchMoveThreshold && !this.isPasswordSet) {
                this.isActive = false;
            }
        },
        onKeyDown(event) {
            if (event.keyCode === 27)
                this.isActive = false;
        },
        handleClick() {
            this.isActive = !this.isActive;
        },
        isMobile(){
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        encryptPassword(password){
            const salt = bcrypt.genSaltSync(10)
            return bcrypt.hashSync(password, salt)
        },
        isValidPassword(password) {
            const passwordRegex = /^.{6,25}$/;
            return passwordRegex.test(password);
        },
        async submitForm() {
            if(this.isValidPassword(this.password)){
                if(this.$store.getters.getViewState == false){
                    this.password = await this.encryptPassword(this.password);
                }
                this.isActive = false;
                this.isPasswordSet = true;
                let isviewer = this.$store.getters.getViewState;
                this.$emit('passwordHelper',this.password,isviewer);
            }else{
                this.error = 'Password must be between 6-25 characters!';
            }
        },


    },
};
</script>

<style scoped>
.password-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f9f9f9;
    padding: 10px;
    transition: transform 0.3s ease-in-out;
    transform: translateY(100%);
}

.password-input.active {
    transform: translateY(0);
}


.inputBoxUp { position: fixed; top: 0; }

.enter_msg{
  display: flex;
  flex: 3;
  position: fixed;
  width: 72%;
  padding: 2% 4%;
}


.input-bx {
  border: 1px solid #111;
  color: white;
}


.msgara{
    background-color: #260b1c;
    border: 1px solid #b92876;
    border-radius: 2px;
    width: 80%;
    padding: 2%;
    height: 38px;
}

.message {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;
}

@keyframes pulsate {
    0% {
        opacity: 0.6;
    }
    50% {
        opacity: 1.0;
    }
    100% {
        opacity: 0.6;
    }
}
.pulsate {
    opacity: 0.6;
    -webkit-animation: pulsate 4s ease-out infinite;
    -webkit-animation-iteration-count: infinite;
}

.text {
    z-index: 1;
}

.slider {
    position: absolute;
    top: 0;
    left: -50px;
    width: 50px;
    height: 100%;
    background: #007aff;
    z-index: 0;
    transition: transform 0.3s ease-in-out;
    transform: translateX(-200px);
}

.message:hover .slider {
    transform: translateX(0);
}

div.text {
    color: #787272;
}

</style>
