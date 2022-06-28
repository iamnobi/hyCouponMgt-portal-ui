<template>
  <div>
    <h3 :class="$attrs['hide-title'] ? 'd-none' : ''" class="mb-2">
      {{ $t('common.query.acquirerBank.title_bank') }}
    </h3>

    <v-select
      ref="selector"
      :value="value"
      :disabled="$attrs['is-disabled']"
      :items="acquirerBankList"
      item-text="name"
      item-value="threeDSOperatorId"
      :label="this.$t('common.query.acquirerBank.label_bank')"
      @change="$emit('input', $event)"
      :hide-details="$attrs.hint || $attrs['error-message'] ? false : true"
      :persistent-hint="true"
      :error-messages="$attrs['error-message']"
      outline
    ></v-select>
  </div>
</template>

<script>
import { apiGetAcquirersList } from '@/api/apiClient/acquirer';

export default {
  inheritAttrs: false,

  props: {
    value: {
      type: String
    },
    showAllBanks: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      acquirerBankList: [],
      loading: false
    };
  },

  created() {
    this.getAcquirerBankList();
  },

  methods: {
    async getAcquirerBankList() {
      this.loading = true;
      try {
        let response = await apiGetAcquirersList();
        this.acquirerBankList = response.data.data;
        this.loading = false;
      } catch (error) {
        throw error;
      }
      //if (this.showAllBanks) {
      this.acquirerBankList.unshift({
        threeDSOperatorId: '0',
        name: this.$t('common.query.acquirerBank.value_allBanks')
      });
      //alert(this.acquirerBankList[0].threeDSOperatorId);
      //}
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-input__slot {
  height: 54px;
  label.v-label--active {
    top: 15px;
  }
  .v-select__selections {
    padding-top: 20px;
  }
  .v-input__append-inner {
    margin-top: 14px;
  }
}
</style>
