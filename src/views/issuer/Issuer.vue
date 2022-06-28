<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.issuer.sub.issuerManage') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.issuer_issuerManage.description') }}
      </template>
    </base-page-title>

    <v-flex xs12>
      <v-alert class="mb-3" :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <issuer-list
      v-if="issuerState"
      :bank-manage-modify="bankManageModify"
      :loading.sync="loading"
      :error-message.sync="errorMessage"
      :issuer-bank-state.sync="issuerState"
    />
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import IssuerList from '@/components/issuer/IssuerList.vue';

export default {
  components: {
    IssuerList
  },
  data() {
    return {
      loading: false,
      errorMessage: null,
      selectEditItem: {},
      issuerState: true
    };
  },
  computed: {
    bankManageModify() {
      return getDecryptLocalStorage('permission').bankManageModify;
    }
  },
  methods: {
    setSelectEditItem(item) {
      this.selectEditItem = item;
    }
  }
};
</script>
