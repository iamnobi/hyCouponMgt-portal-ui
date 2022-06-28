<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    @input="$emit('close-dialog', $event)"
    :max-width="$attrs['max-width'] || '750px'"
    :persistent="$attrs['persistent'] !== false"
  >
    <v-card class="pt-2 pb-1 px-3">
      <v-container fluid grid-list-lg class="pa-2">
        <v-card-title>
          <span class="headline"> <slot name="dialogTitle"> </slot></span>
        </v-card-title>
        <p v-if="this.$slots.dialogSubTitle" class="pl-3 mb-0 grey--text">
          <slot name="dialogSubTitle"> </slot>
        </p>
        <v-card-text>
          <v-form ref="form" lazy-validation @submit="submit">
            <base-page-loading
              v-if="$attrs.loading"
              class="mb-4"
            ></base-page-loading>
            <slot v-else name="dialogContent"></slot>

            <div class="text-xs-center pt-3">
              <v-btn
                round
                outline
                color="primary"
                @click="closeDialog"
                :disabled="$attrs.sending || disableCancelButton"
              >
                {{ $t('common.btn.cancel') }}
              </v-btn>
              <v-btn
                type="submit"
                :disabled="disableSubmitButton"
                :loading="$attrs.sending"
                round
                color="primary"
              >
                {{ $t('common.btn.submit') }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  inject: {
    $validator: '$validator'
  },

  inheritAttrs: false,

  props: {
    value: Boolean,
    data: {
      type: Object
    },

    disableSubmitButton: {
      type: Boolean,
      default: false
    },

    disableCancelButton: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    reset() {
      this.$validator.reset();
    },

    async submit(e) {
      e.preventDefault();
      if (await this.$validator.validateAll()) {
        this.$emit('submit-form');
      } else {
        this.$emit('validate-error');
      }
    },

    closeDialog() {
      this.reset();
      this.$emit('close-dialog');
    }
  }
};
</script>
