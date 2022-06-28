<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.acquirer.sub.acquirerManage') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.acquirer_acquirerManage.description') }}
      </template>
    </base-page-title>

    <v-flex xs12>
      <v-alert class="mb-3" :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <acquirer-list
      :acquirer-bank-modify="acquirerBankModify"
      :loading.sync="loadingList"
      :error-message.sync="errorMessage"
      @set-selected-acquirer="setSelectedAcquirer"
      @onAcquirerChange="onAcquirerChange"
    />

    <v-flex xs12>
      <div v-if="showAcquirerBinListArea">
        <acquirer-bin-list
          :acquirer-bank-modify="acquirerBankModify"
          :loading.sync="loadingBinList"
          :error-message.sync="errorMessage"
          :selected-acquirer-id="selectedAcquirerId"
          :selected-acquirer-name="selectedAcquirerName"
        >
        </acquirer-bin-list>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import AcquirerList from '@/components/acquirer/AcquirerList.vue';
import AcquirerBinList from '@/components/acquirer/AcquirerBinList.vue';

export default {
  components: {
    AcquirerList,
    AcquirerBinList
  },
  data() {
    return {
      selectedAcquirerId: '',
      selectedAcquirerName: '',
      showAcquirerBinListArea: false,
      loadingList: false,
      loadingBinList: false,
      errorMessage: null
    };
  },
  computed: {
    acquirerBankModify() {
      return getDecryptLocalStorage('permission').acquirerBankModify;
    }
  },
  methods: {
    setSelectedAcquirer(item) {
      this.selectedAcquirerId = item.id;
      this.selectedAcquirerName = item.name;
      this.showAcquirerBinListArea = true;
    },
    onAcquirerChange() {
      this.showAcquirerBinListArea = false;
    }
  }
};
</script>
