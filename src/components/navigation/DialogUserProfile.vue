<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="1000"
    :value="dialogUserProfileState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('toolbar.personalSetting.dialog_profile.title') }}
    </template>
    <template slot="dialogContent">
      <base-page-loading v-if="loading"></base-page-loading>

      <v-layout v-if="userData && loading === false" row wrap>
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                v-model="userData.account"
                :label="
                  $t('toolbar.personalSetting.dialog_profile.label_userAccount')
                "
                outline
                disabled
              >
              </v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                v-model.trim="userData.name"
                :label="
                  $t('toolbar.personalSetting.dialog_profile.label_userName')
                "
                :data-vv-as="
                  $t('toolbar.personalSetting.dialog_profile.label_userName')
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
                v-model="userData.email"
                :label="
                  $t('toolbar.personalSetting.dialog_profile.label_email')
                "
                outline
                disabled
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12> <v-divider></v-divider> </v-flex>
        <v-flex xs12>
          <h4 class="grey--text text--darken-2">
            {{
              $t('toolbar.personalSetting.dialog_profile.title_optionalItem')
            }}
          </h4>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model.trim="userData.department"
            :label="
              $t(
                'toolbar.personalSetting.dialog_profile.label_departmentCategory'
              )
            "
            :data-vv-as="
              $t(
                'toolbar.personalSetting.dialog_profile.label_departmentCategory'
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
            v-model.trim="userData.phone"
            :label="$t('toolbar.personalSetting.dialog_profile.label_phone')"
            :data-vv-as="
              $t('toolbar.personalSetting.dialog_profile.label_phone')
            "
            maxLength="13"
            counter="13"
            outline
          >
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model.trim="userData.ext"
            :label="
              $t('toolbar.personalSetting.dialog_profile.label_extension')
            "
            :data-vv-as="
              $t('toolbar.personalSetting.dialog_profile.label_extension')
            "
            name="ext"
            v-validate="'numeric'"
            :error-messages="errors.first('ext')"
            maxLength="15"
            outline
          >
          </v-text-field>
        </v-flex>
      </v-layout>

      <v-alert :value="errorMessage" type="error"> {{ errorMessage }} </v-alert>
    </template>
  </base-dialog-form>
</template>

<script>
import alertUtil from '@/utils/alertUtil.js';
import {
  apiGetUserProfile,
  apiUpdateUserProfile
} from '@/api/apiClient/personalSetting';

export default {
  props: {
    dialogUserProfileState: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      userData: null,
      errorMessage: null,
      loading: false,
      sending: false
    };
  },

  watch: {
    dialogUserProfileState(val) {
      if (val) {
        this.getUserProfile();
      }
    }
  },

  created() {
    this.errorMessage = null;
  },

  methods: {
    async getUserProfile() {
      this.errorMessage = null;
      this.loading = true;
      try {
        let response = await apiGetUserProfile();
        this.userData = response.data.data;
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.loading = false;
    },

    async submitForm() {
      if (await this.$validator.validateAll()) {
        this.errorMessage = null;
        this.sending = true;
        try {
          await apiUpdateUserProfile(
            this.userData.name,
            this.userData.department,
            this.userData.phone,
            this.userData.ext
          );
          alertUtil.sendCompleteAlert();
          this.closeDialog();
        } catch (error) {
          this.errorMessage = error.message;
        } finally {
          this.sending = false;
        }
      }
    },

    closeDialog() {
      this.$emit('update:dialogUserProfileState', false);
    }
  }
};
</script>
