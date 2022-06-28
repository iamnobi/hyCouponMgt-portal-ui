<template>
  <div class="align-start" style="display: inline-flex">
    <v-icon small :color="color" class="pr-2" style="line-height: 21px;"
      >info</v-icon
    >
    <span :class="`${color}--text`"> <slot>Instructions </slot></span>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    }
  }
};
</script>
