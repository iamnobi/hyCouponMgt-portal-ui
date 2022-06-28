<template>
  <div>
    <the-toolbar @change-drawer-state="drawer = !drawer"></the-toolbar>

    <the-sidebar :drawer="drawer"></the-sidebar>

    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer
      dark
      fixed
      class="grey lighten-2 px-3"
      height="22"
      style="min-height: 22px; color: grey;"
    >
      <span class="grey--text text--darken-1" style="font-size: 12px;">
        &copy; {{ $t('page.login.rightsStatement') }}
      </span>

      <v-spacer></v-spacer>
      <span class="pt-1" style="font-size: 11px;"
        ><i>{{ $t('page.login.suggestion') }}</i></span
      >
    </v-footer>
  </div>
</template>
<script>
import TheSidebar from '@/components/navigation/TheSidebar.vue';
import TheToolbar from '@/components/navigation/TheToolbar.vue';

export default {
  components: {
    TheToolbar,
    TheSidebar
  },

  data() {
    return {
      drawer: true
    };
  }
};
</script>
