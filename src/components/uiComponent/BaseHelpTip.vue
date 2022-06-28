<template>
  <v-tooltip v-bind="$attrs" class="statist-tooltip" bottom>
    <template v-slot:activator="{ on }">
      <v-icon class="cursor-pointer" color="secondary" small dark v-on="on"
        >help</v-icon
      >
    </template>
    <span v-if="$attrs['tip-msg']">
      {{ $attrs['tip-msg'] }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  inheritAttrs: false
};
</script>
