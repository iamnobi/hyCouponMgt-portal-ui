<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.acquirer.sub.3dsSdk') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.acquirer_3dsSdk.description') }}
      </template>
    </base-page-title>

    <v-flex xs12>
      <v-alert class="mb-3" :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <threeds-sdk-list
      :acquirer-bank-modify="acquirerBankModify"
      :error-message.sync="errorMessage"
    ></threeds-sdk-list>
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import ThreedsSdkList from '@/components/acquirer/ThreedsSdkList.vue';

export default {
  components: {
    ThreedsSdkList
  },
  data() {
    return {
      errorMessage: null
    };
  },
  computed: {
    acquirerBankModify() {
      return getDecryptLocalStorage('permission').acquirerBankModify;
    }
  },
  methods: {}
};
</script>
