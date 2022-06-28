<template>
  <div>
    <div class="pl-3 d-flex align-center" v-if="settingState">
      <v-icon color="success" class="pr-1">check_circle </v-icon>
      <span class="success--text font-16 ">
        {{ $t('page.certificate_deviceInfo.status_set') }}</span
      >
    </div>
    <div class="pl-3 d-flex align-center" v-else>
      <v-icon color="error" class="pr-1 flex-0-0-auto">error_outline </v-icon>
      <span class="error--text font-16">
        {{ $t('page.certificate_deviceInfo.status_unset') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    settingState: {
      type: Boolean,
      default: false
    }
  }
};
</script>
