<template>
  <div>
    <div v-if="certificateState === 'success'" class="pl-3 d-flex align-center">
      <v-icon color="success" class="pr-1 flex-0-0-auto">check_circle </v-icon>
      <span class="success--text font-16">
        {{ $t('page.certificate_ssl.status_success') }}</span
      >
    </div>

    <div v-if="certificateState === 'unset'" class="pl-3 d-flex align-center">
      <v-icon color="error" class="pr-1 flex-0-0-auto">error_outline </v-icon>
      <span class="error--text font-16">
        {{ $t('page.certificate_ssl.status_unset') }}</span
      >
    </div>

    <div v-if="certificateState === 'renew'" class="pl-3 d-flex align-center">
      <v-icon color="amber darken-2" class="pr-1 flex-0-0-auto">info </v-icon>
      <span class="amber--text text--darken-3 font-16">
        {{ $t('page.certificate_ssl.status_renew') }}</span
      >
    </div>

    <div v-if="certificateState === 'expire'" class="pl-3 d-flex align-center">
      <v-icon color="amber darken-2" class="pr-1 flex-0-0-auto">info </v-icon>
      <span class="amber--text text--darken-3 font-16">
        {{ $t('page.certificate_ssl.status_expire') }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    certificateState: {
      type: String,
      default: 'unset'
    }
  }
};
</script>
