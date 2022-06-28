<template>
  <div class="grey lighten-4">
    <template v-if="expanedData">
      <v-layout wrap>
        <v-flex
          xs6
          wrap
          class="font-14"
          style="border-bottom: 1px solid #fff;"
          v-for="(item, index) in expanedList"
          :key="index"
        >
          <v-layout style="border-right: 1px solid #fff;">
            <v-flex xs4 class="py-3 px-3">
              <span
                class="primary--text d-inline-block"
                style="word-break: break-all;"
              >
                {{ index + 1 }}. {{ item.name }}</span
              >
            </v-flex>
            <v-flex xs8 class="pr-4 py-3">
              <span class="d-inline-block" style="word-break: break-all;">
                {{ item.value }}</span
              >
            </v-flex>
            <!-- 若最後一行只有一個就不顯示 -->
            <template
              v-if="
                expanedList.length !== index + 1 && expanedList.length % 2 === 1
              "
            >
              <v-divider></v-divider>
            </template>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </template>

    <template v-else>
      <div class="text-xs-center py-3">{{ $t('common.table.noData') }}</div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    expanedData: String
  },

  computed: {
    expanedList() {
      return this.expanedData.split('|').map(item => {
        let name = item.split('=')[0];
        let value = item.substring(item.indexOf('=') + 1, item.length);
        return {
          name,
          value
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sub {
  width: 33.3%;
  justify-content: stretch;
  word-break: break-word;
  > div {
    width: 100%;
  }
}
.sub:nth-child(n + 1):nth-child(-n + 5) .v-subheader + div {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  min-height: 48px;
}
</style>
