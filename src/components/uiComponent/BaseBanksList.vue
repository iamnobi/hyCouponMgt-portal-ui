<template>
  <div>
    <h3 :class="$attrs['hide-title'] ? 'd-none' : ''" class="mb-2">
      {{ $t('common.query.bank.title_bank') }}
    </h3>

    <!--TODO 精簡一下-->
    <v-select
      :items="issuerBankItems"
      item-text="issuerBankName"
      item-value="id"
      :disabled="$attrs['is-disabled']"
      @change="changeIssuerBankNameId($event)"
      :label="
        showAllBanks
          ? this.$t('common.query.bank.label_institution')
          : this.$t('common.query.bank.label_bank')
      "
      outline
      :hide-details="$attrs.hint || $attrs['error-message'] ? false : true"
      :persistent-hint="true"
      :hint="$attrs.hint ? $attrs.hint : undefined"
      :value="issuerBankId"
      :error-messages="$attrs['error-message']"
      class="baseBanksList"
    >
    </v-select>
  </div>
</template>

<script>
import { GlobalConfig } from '@/config';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  inheritAttrs: false,

  props: {
    issuerBankId: {
      type: Number
    },

    showAllBanks: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      issuerBankItems: []
    };
  },

  computed: {
    ...mapState('issuerBanks', ['issuerBankNames', 'loading']),

    ...mapGetters({
      getLanguage: 'i18nStore/getLang'
    })
  },

  watch: {
    getLanguage() {
      this.getIssuerBankItems();
    }
  },

  async created() {
    await this.getIssuerBanks({
      page: 1,
      pageSize: 50
    });
    await this.getIssuerBankItems();
  },

  methods: {
    ...mapActions('issuerBanks', ['getIssuerBanks']),

    ...mapMutations('issuerBanks', ['setSelectedIssuerBanksId']),

    changeIssuerBankNameId(e) {
      this.$emit('update:issuerBankId', e);
      this.setSelectedIssuerBanksId(e);
    },

    getIssuerBankItems() {
      this.issuerBankItems = this.issuerBankNames;
      this.issuerBankItems = this.issuerBankItems.filter(
        item => item.id !== GlobalConfig.MULTIBANKS_ORG_ID
      );
      if (this.showAllBanks) {
        this.issuerBankItems.unshift({
          id: 0,
          issuerBankName: this.$t('common.query.bank.value_allBanks')
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.baseBanksList ::v-deep .v-input__slot {
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
