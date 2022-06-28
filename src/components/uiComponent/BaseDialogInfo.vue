<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    @input="$emit('close-dialog', $event)"
    :max-width="$attrs['max-width'] || '750px'"
    :persistent="$attrs['persistent'] !== false"
  >
    <v-card class="pt-2 pb-1">
      <v-container fluid grid-list-lg class="pa-2">
        <v-card-title class="pb-1">
          <span class="headline"> <slot name="dialogTitle"> </slot></span>
        </v-card-title>
        <span class="pl-3 grey--text"
          ><slot name="dialogSubTitle"> </slot
        ></span>
        <v-card-text>
          <slot name="dialogContent"></slot>
          <div class="text-xs-center pt-3">
            <v-btn round outline color="primary" @click="$emit('close-dialog')">
              {{ $t('common.btn.close') }}
            </v-btn>
          </div>
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    value: Boolean,
    data: {
      type: Object
    }
  }
};
</script>
