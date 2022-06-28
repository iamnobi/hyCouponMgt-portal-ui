<template>
  <v-layout wrap>
    <dialog-upload-mcc-list
      :mcc-list-modify="mccListModify"
      :dialog-upload-mcc-list-state.sync="dialogUploadMccListState"
      @get-mcc-list="getMccList"
    >
    </dialog-upload-mcc-list>

    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.systemSetting.sub.mcc') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.systemSetting_mcc.description') }}
      </template>
    </base-page-title>

    <v-flex xs12 v-if="errorMessage">
      <v-alert class="mb-3" :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <v-flex xs12>
      <v-card class="pb-3">
        <v-layout align-center class="py-3 px-2 white">
          <v-btn
            @click="dialogUploadMccListState = true"
            :disabled="!mccListModify"
            round
            outline
            color="primary"
            class="mb-2"
          >
            <v-icon class="mr-2" style="transform: rotate(180deg)">
              playlist_add
            </v-icon>
            <span class="vertical-align-text-bottom">
              {{ $t('page.systemSetting_mcc.btn_uploadMccList') }}
            </span>
          </v-btn>
        </v-layout>

        <v-divider></v-divider>

        <v-layout>
          <v-flex pl-4 py-3>
            <h3>
              {{ $t('page.systemSetting_mcc.mccList.title') }}
            </h3>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>

        <v-data-table
          class="fixed-table-header"
          hide-actions
          :loading="loading"
          :items="pageData ? pageData.data : []"
          :headers-length="5"
          :no-data-text="$t('common.table.noData')"
          item-key="index"
        >
          <template v-slot:headers>
            <tr>
              <th align="left">
                {{ $t('page.systemSetting_mcc.mccList.th_mccCode') }}
              </th>
            </tr>
          </template>

          <template slot="items" slot-scope="mccCode">
            <tr>
              <td align="left">
                {{ mccCode.item }}
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import DialogUploadMccList from '@/components/systemSetting/DialogUploadMccList.vue';
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import { apiGetMccList } from '@/api/apiClient/systemSetting_mccList';

export default {
  components: {
    DialogUploadMccList
  },

  data() {
    return {
      dialogUploadMccListState: false,
      errorMessage: null,
      loading: false,
      pageData: []
    };
  },

  computed: {
    mccListModify() {
      return getDecryptLocalStorage('permission').generalSettingModify;
    }
  },

  created() {
    this.getMccList();
  },

  methods: {
    async getMccList() {
      try {
        this.loading = true;
        this.errorMessage = null;
        let response = await apiGetMccList();
        this.pageData = response.data;
      } catch (error) {
        this.errorMessage = error.message;
      }

      this.loading = false;
    }
  }
};
</script>
