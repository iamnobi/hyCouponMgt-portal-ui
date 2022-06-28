<template>
  <div>
    <v-divider class="my-3"></v-divider>
    <div class="text-xs-center">
      <v-btn
        v-if="clickSearchBtnOnce"
        round
        outline
        :disabled="$attrs.loading || disableSubmitBtn"
        @click="$emit('reset-search-criteria')"
        color="primary"
        class="mb-2"
      >
        <slot name="cancel">
          <v-icon>cached</v-icon>
          {{ $t('common.btn.reset') }} &nbsp;
        </slot>
      </v-btn>
      <v-btn
        v-if="showSubmitBtn"
        :disabled="disableSubmitBtn"
        :loading="$attrs.loading"
        round
        color="primary"
        class="mb-2"
        @click="$emit('submit-search')"
      >
        <slot name="submit">
          <v-icon>search</v-icon>
          {{ $t('common.btn.query') }}
        </slot>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clickSearchBtnOnce: {
      type: Boolean,
      default: false
    },

    showSubmitBtn: {
      type: Boolean,
      default: true
    },

    disableSubmitBtn: {
      type: Boolean,
      default: false
    }
  }
};
</script>
