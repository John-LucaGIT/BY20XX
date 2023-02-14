<template>
    <div class="pulsate text" @click="handleClick">
        <span>{{ message }}</span>
        <span class="pulsate"></span>
    </div>
    <div class="password-input" :class="{ 'active': isActive }">
        <div class="message" v-if="!isPasswordSet">
            <div class="slider" v-if="isActive" ref="slider"></div>
        </div>
        <input type="password" v-model="password" v-if="isActive" placeholder="Enter password">
    </div>
</template>

<script>
export default {
    name: 'Password',
    data() {
        return {
            isActive: false,
            isDragging: false,
            startX: 0,
            password: '',
            isPasswordSet: false,
            message: 'Swipe up to set password',
        };
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    },
    methods: {
        handleScroll() {
            if (window.scrollY > 100 && !this.isPasswordSet) {
                this.isActive = true;
            }
        },
        handleClick() {
            if (!this.isPasswordSet) {
                this.isActive = true;
            }
        },
        handleMouseDown(event) {
            if (!this.isPasswordSet) {
                this.isDragging = true;
                this.startX = event.clientX;
            }
        },
        handleMouseMove(event) {
            if (this.isDragging) {
                const slider = this.$refs.slider;
                const x = event.clientX - this.startX;
                slider.style.transform = `translateX(${x}px)`;
                if (x >= 200) {
                    this.isDragging = false;
                    this.isActive = false;
                    this.isPasswordSet = true;
                    this.$emit('password-set', this.password);
                }
            }
        },
        handleMouseUp() {
            if (this.isDragging) {
                this.isDragging = false;
                const slider = this.$refs.slider;
                slider.style.transform = '';
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
