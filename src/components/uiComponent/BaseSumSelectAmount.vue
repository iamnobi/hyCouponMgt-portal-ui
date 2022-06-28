<template>
  <h3 class="px-2">
    {{ $t('common.table.inquire.prefix') }}
    <span class="primary--text px-1 font-weight-medium">
      {{ total }}
    </span>
    {{ $tc('common.table.inquire.results', total) }}

    <template v-if="selectedAmount">
      {{ $t('common.table.inquire.infix') }}
      <span class="primary--text px-1 font-weight-medium">
        {{ selectedAmount }}
      </span>
      {{ $tc('common.table.inquire.results', selectedAmount) }}
    </template>
  </h3>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    total: {
      type: Number,
      required: false
    },
    selectedAmount: {
      type: Number,
      required: false
    }
  }
};
</script>
