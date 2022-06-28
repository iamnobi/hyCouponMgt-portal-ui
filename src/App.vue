<template>
  <v-app id="inspire" class="grey lighten-4">
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  created() {
    this.checkIfIe11();
  },

  mounted() {
    if (this.$store.state.isIe11) {
      window.addEventListener(
        'hashchange',
        () => {
          let currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        },
        false
      );
    }
  },

  methods: {
    checkIfIe11() {
      const isIE11 = window.MSInputMethodContext && document.documentMode;

      if (isIE11) {
        this.$store.commit('changeIsIe11', true);
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/style/main.scss';
</style>
