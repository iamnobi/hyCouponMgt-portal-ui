<template>
  <v-flex
    class="fill-height kv_bg"
    :style="
      kvPath
        ? {
            'background-image': `url(${kvPath})`
          }
        : ''
    "
  >
    <div class="orgLogo" v-if="$config.SHOW_LOGO">
      <img :src="logoPath" alt="Logo" />
    </div>
    <template v-if="!kvPath">
      <div class="decoration-dots">
        <span class="dot" v-for="item in 10" :key="item"> </span>
      </div>
      <div class="decoration-bttoom">
        <div class="decoration-bttoom-position">
          <div class="line-image">
            <img :src="linePath" alt="" />
          </div>
          <div class="left-circle-group">
            <div class="circle circle01"></div>
            <div class="circle circle02"></div>
          </div>
          <div class="right-circle-group">
            <div class="circle circle03"></div>
          </div>
        </div>
      </div>
    </template>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      logoPath: this.$config.LOGO_LOGIN_PATH,
      kvPath: this.$config.KV_PATH,
      linePath: require('@/assets/img_wave.png')
    };
  }
};
</script>

<style lang="scss" scoped>
.orgLogo {
  position: relative;
  text-align: center;
  top: 30%;
  img {
    height: 65px;
  }
}

.kv_bg {
  background: $Login-Bg-Light-Color;
  background: linear-gradient(
    135deg,
    $Login-Bg-Deep-Color,
    $Login-Bg-Light-Color
  );
  background-size: 100% 100%;
  align-self: stretch;
  position: relative;
}

.welcome-title {
  position: relative;
  top: 37%;
  margin-bottom: 0px;
  font-size: 27px;
  font-weight: 600;
  letter-spacing: 1px;
}

.welcome-subtitle {
  position: relative;
  top: 38%;
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 1px;
}

.decoration-dots {
  width: 25px;
  position: absolute;
  left: 40px;
  top: 50px;
}

.dot {
  width: 4px;
  height: 4px;
  display: inline-block;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100%;
  margin: 0 3px;
}

.decoration-bttoom {
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
}

.decoration-bttoom-position {
  position: relative;
}

.circle {
  border-radius: 100%;
  background: rgba(255, 255, 255, 0.85);
  display: inline-block;
  position: relative;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  &.circle01 {
    width: 20px;
    height: 20px;
    position: relative;
    margin-right: 10px;
    top: -45px;
    animation-name: moveUp;
    animation-duration: 2.5s;
  }
  &.circle02 {
    width: 55px;
    height: 55px;
    animation-name: moveUp;
    animation-duration: 2.5s;
  }
  &.circle03 {
    width: 120px;
    height: 120px;
    animation-name: moveUpLarge;
    animation-duration: 3s;
  }
}

.left-circle-group {
  position: absolute;
  left: 3%;
  top: 8%;
  transform: translate(35%, -50%);
}

.right-circle-group {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(35%, -50%);
}

.line-image {
  overflow: hidden;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  animation-name: lineMove;
  animation-duration: 2s;
}

.line-image img {
  width: 102%;
  position: relative;
  left: -10px;
  opacity: 0.9;
}

@keyframes lineMove {
  0% {
    opacity: 0.9;
    transform: translateY(-3px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0.9;
    transform: translateY(-3px);
  }
}

@keyframes moveUp {
  0% {
    opacity: 0.8;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-7px);
  }

  100% {
    opacity: 0.8;
    transform: translateY(0);
  }
}

@keyframes moveUpLarge {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-13px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
