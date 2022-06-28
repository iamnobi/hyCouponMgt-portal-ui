<template>
  <div>
    <v-alert class="my-3" type="error" :value="errorMessage">
      {{ errorMessage }}
    </v-alert>

    <dialog-add-member
      @get-custom-group-members="getCustomGroupMembers"
      :dialog-add-member-state.sync="dialogAddMemberState"
      :issuer-bank-id="issuerBankId"
      :select-group-id="selectGroupId"
    ></dialog-add-member>

    <v-card class="mt-4 pb-4" xs12>
      <v-layout row wrap>
        <v-flex xs12 class="py-1">
          <v-btn
            @click="openAddMemberDialog"
            round
            outline
            :disabled="!userGroupModify"
            color="primary"
            class="my-3 ml-3"
          >
            <v-icon>playlist_add</v-icon>
            {{ $t('page.account_groupPermission.btn_addMemberList') }}
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-divider></v-divider>
          <h3 class="pa-4">
            {{ $t('page.account_groupPermission.memberList.title') }}
            {{ groupName }}
          </h3>
          <v-divider></v-divider>
        </v-flex>
        <v-data-table
          class="fixed-table-header"
          hide-actions
          :items="pageData ? pageData.data : []"
          :headers-length="3"
          :no-data-text="$t('common.table.noData')"
          :loading="loading"
          item-key="account"
        >
          <template v-slot:headers="props">
            <tr :class="props.thead">
              <th align="left" width="30%">
                {{
                  $t('page.account_groupPermission.memberList.th_userAccount')
                }}
              </th>
              <th align="left" width="40%">
                {{ $t('page.account_groupPermission.memberList.th_userName') }}
              </th>
              <th align="center" width="20%">
                {{ $t('page.account_groupPermission.memberList.th_remove') }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td align="left" width="30%" class="word-break-all">
                {{ props.item.account }}
              </td>
              <td align="left" width="40%" class="word-break-all">
                {{ props.item.name }}
              </td>
              <td align="center" width="20%">
                <v-btn
                  icon
                  :disable-delete-btn="userGroupModify === false"
                  @click="removeGroupMember(props.item.account)"
                  ><v-icon color="error">remove_circle_outline</v-icon></v-btn
                >
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12>
          <div class="text-xs-center pt-3" v-if="pageData">
            <v-pagination
              circle
              total-visible="10"
              v-model="currentPage"
              :length="pageData.totalPages"
            >
            </v-pagination>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { confirmRemove } from '@/mixins/alertTextCollection';
import DialogAddMember from '@/components/accountManagement/DialogAddMember.vue';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiDeleteCustomGroupMember,
  apiGetCustomGroupMembers
} from '@/api/apiClient/accountManagement';

export default {
  inheritAttrs: false,

  mixins: [confirmRemove],

  components: {
    DialogAddMember
  },

  props: {
    userGroupModify: {
      type: Boolean
    },

    groupName: {
      type: String
    },

    selectGroupId: {
      type: Number
    },

    issuerBankId: {
      type: Number
    }
  },

  data() {
    return {
      errorMessage: null,
      loading: false,
      dialogAddMemberState: false,

      pageData: null
    };
  },

  computed: {
    currentPage: {
      get() {
        return this.pageData.currentPage;
      },
      set(page) {
        this.getCustomGroupMembers(page);
      }
    }
  },

  watch: {
    selectGroupId() {
      this.getCustomGroupMembers();
    }
  },

  created() {
    this.getCustomGroupMembers();
  },

  methods: {
    async getCustomGroupMembers(page = 1) {
      let pageSize = 10;
      this.loading = true;
      try {
        let response = await apiGetCustomGroupMembers(
          this.selectGroupId,
          page,
          pageSize
        );

        this.pageData = response.data.data;

        this.$emit('add-member');
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.loading = false;
    },

    async removeGroupMember(account) {
      this.$swal(this.confirmRemove).then(async result => {
        if (result.value) {
          this.errorMessage = null;
          try {
            await apiDeleteCustomGroupMember(
              this.issuerBankId,
              account,
              this.selectGroupId
            );
            this.getCustomGroupMembers();
            alertUtil.sendCompleteAlert();
            this.$emit('remove-member');
          } catch (error) {
            this.errorMessage = error.message;
          }
        }
      });
    },

    openAddMemberDialog() {
      this.dialogAddMemberState = true;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .error-btn .v-btn {
  min-width: 30px;
  border-radius: 4px;
}

.word-break-all {
  word-break: break-all;
}
</style>
