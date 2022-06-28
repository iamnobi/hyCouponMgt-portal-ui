<template>
  <div>
    <!-- 匯出全部 -->
    <v-btn
      v-if="selectedLength === 0"
      @click="exportAllData"
      :loading="downloading"
      round
      outline
      color="primary"
      class="mb-2"
    >
      <v-icon>get_app</v-icon>
      <span class="vertical-align-text-bottom">
        {{ $t('common.btn.exportAll') }}
      </span>
    </v-btn>

    <!-- 匯出勾選項目 -->
    <v-btn
      v-if="selectedLength > 0"
      @click="exportSelectData"
      :loading="downloading"
      round
      outline
      color="primary"
      class="mb-2"
    >
      <v-icon>get_app</v-icon>
      <span class="vertical-align-text-bottom">
        {{ $t('common.btn.exportSelect') }}
        <span class="px-1 secondary--text font-17">{{ selectedLength }}</span>
        {{ $tc('common.btn.exportSelect_item', selectedLength) }}
      </span>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    selectedLength: {
      type: Number,
      default: 0
    },

    downloading: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    exportAllData() {
      this.$emit('export-all-data');
    },

    exportSelectData() {
      this.$emit('export-select-data');
    }
  }
};
</script>
