<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="1000"
    :value="dialogEditUserState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{
        isNew
          ? $t('page.account_userManage.dialog_editUser.title_create')
          : $t('page.account_userManage.dialog_editUser.title_edit')
      }}
    </template>
    <template slot="dialogContent">
      <!--TODO 設計到Base Dialog Form中-->
      <base-page-loading v-if="loading" class="mb-4"></base-page-loading>

      <v-layout v-else class="inputDisabled" row wrap>
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                v-model.trim="account"
                :label="
                  $t(
                    'page.account_userManage.dialog_editUser.label_userAccount'
                  )
                "
                :data-vv-as="
                  $t(
                    'page.account_userManage.dialog_editUser.label_userAccount'
                  )
                "
                v-validate="'required|alpha_num'"
                name="account"
                :maxLength="50"
                :counter="50"
                :outline="isNew"
                :box="!isNew"
                :disabled="!isNew"
                :error-messages="errors.first('account')"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                v-model.trim="name"
                :label="
                  $t('page.account_userManage.dialog_editUser.label_userName')
                "
                :data-vv-as="
                  $t('page.account_userManage.dialog_editUser.label_userName')
                "
                name="name"
                v-validate="'required'"
                :error-messages="errors.first('name')"
                maxLength="50"
                counter="50"
                outline
              >
              </v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                v-model.trim="email"
                :label="
                  $t('page.account_userManage.dialog_editUser.label_email')
                "
                :data-vv-as="
                  $t('page.account_userManage.dialog_editUser.label_email')
                "
                name="email"
                v-validate="'required|email'"
                :error-messages="errors.first('email')"
                maxLength="80"
                counter="80"
                :outline="isNew"
                :box="!isNew"
                :disabled="!isNew"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-select
                v-model.trim="group"
                :label="
                  $t('page.account_userManage.dialog_editUser.label_group')
                "
                :data-vv-as="
                  $t('page.account_userManage.dialog_editUser.label_group')
                "
                :items="groupItems"
                item-text="name"
                item-value="groupId"
                persistent-hint
                :hint="$t('page.account_userManage.dialog_editUser.hint_group')"
                name="group"
                v-validate="'required'"
                :error-messages="errors.first('group')"
                class="bg-white auto-height word-break-all"
                multiple
                attach
                outline
              ></v-select>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12>
          <h4 class="grey--text text--darken-2">
            {{
              $t('page.account_userManage.dialog_editUser.title_optionalItem')
            }}
          </h4>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model.trim="department"
            :label="
              $t(
                'page.account_userManage.dialog_editUser.label_departmentCategory'
              )
            "
            :data-vv-as="
              $t(
                'page.account_userManage.dialog_editUser.label_departmentCategory'
              )
            "
            maxLength="50"
            counter="50"
            outline
          >
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model.trim="phone"
            :label="$t('page.account_userManage.dialog_editUser.label_phone')"
            :data-vv-as="
              $t('page.account_userManage.dialog_editUser.label_phone')
            "
            maxLength="13"
            counter="13"
            outline
          >
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model.trim="ext"
            :label="
              $t('page.account_userManage.dialog_editUser.label_extension')
            "
            :data-vv-as="
              $t('page.account_userManage.dialog_editUser.label_extension')
            "
            name="ext"
            v-validate="'numeric'"
            :error-messages="errors.first('ext')"
            maxLength="15"
            outline
          >
          </v-text-field>
        </v-flex>

        <!--NOTE: LDAP模式下，不需寄送電子郵件-->
        <v-layout
          v-if="isNew && isLdapMode === false"
          row
          wrap
          class="grey lighten-5 pa-4 ma-0"
        >
          <base-operation-prompt>
            {{ $t('page.account_userManage.dialog_editUser.prompt') }}
          </base-operation-prompt>
        </v-layout>

        <v-flex xs12>
          <v-alert :value="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>
        </v-flex>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiCreateUser,
  apiGetUser,
  apiGetUserGroupList,
  apiUpdateUser
} from '@/api/apiClient/accountManagement';

export default {
  props: {
    dialogEditUserState: {
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: true
    },
    issuerBankId: {
      type: Number
    },
    selectUserData: {
      type: Object
    }
  },

  data() {
    return {
      groupItems: [],
      id: '',
      name: '',
      account: '',
      email: '',
      group: [],
      department: '',
      phone: '',
      ext: '',
      errorMessage: null,
      loading: false,
      sending: false
    };
  },

  computed: {
    userGroupQuery() {
      return getDecryptLocalStorage('permission').userGroupQuery;
    },

    isLdapMode() {
      return getDecryptLocalStorage('uiConfig').isLdapMode;
    }
  },

  watch: {
    dialogEditUserState(val) {
      if (val) {
        this.getGroupLists();
        if (this.isNew === false) {
          this.getUser();
        }
      }
    }
  },

  created() {
    if (getDecryptLocalStorage('uiConfig') === null) {
      alertUtil.loginAgain();
    }
  },

  methods: {
    async getUser() {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await apiGetUser(
          this.issuerBankId,
          this.selectUserData.id
        );
        let userData = response.data.data;
        this.id = userData.id;
        this.name = userData.name;
        this.account = userData.account;
        this.email = userData.email;
        this.group = userData.groupList
          ? userData.groupList.map(item => item.groupId)
          : [];
        this.department = userData.department;
        this.phone = userData.phone;
        this.ext = userData.ext;
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.loading = false;
    },

    async getGroupLists() {
      try {
        let response = await apiGetUserGroupList();
        this.groupItems = response.data.data;
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    async submitForm() {
      if (!this.userGroupQuery) {
        alertUtil.noPermission();
        return;
      }

      this.errorMessage = null;
      this.sending = true;

      try {
        if (this.isNew) {
          await apiCreateUser(
            this.name,
            this.account,
            this.email,
            this.group,
            this.department,
            this.phone,
            this.ext,
            this.issuerBankId
          );
        } else {
          await apiUpdateUser(
            this.id,
            this.name,
            this.account,
            this.email,
            this.group,
            this.department,
            this.phone,
            this.ext,
            this.issuerBankId
          );
        }
        alertUtil.sendCompleteAlert();
        this.$emit('submit-form');
        this.closeDialog();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    closeDialog() {
      this.resetDialog();
      this.$emit('update:dialogEditUserState', false);
      this.errorMessage = null;
    },

    resetDialog() {
      this.$validator.reset();
      this.id = '';
      this.name = '';
      this.account = '';
      this.email = '';
      this.group = '';
      this.department = '';
      this.phone = '';
      this.ext = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.inputDisabled {
  /deep/ .v-input--is-disabled {
    .v-input__slot {
      border: 2px solid rgba(0, 0, 0, 0.1) !important;
      border-radius: 4px;

      &:before,
      &:after {
        visibility: hidden;
      }
    }
  }
}
</style>
