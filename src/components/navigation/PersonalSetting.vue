<template>
  <div>
    <dialog-user-profile
      :dialog-user-profile-state.sync="dialogUserProfileState"
    >
    </dialog-user-profile>
    <dialog-change-password
      :dialog-change-password-state.sync="dialogChangePasswordState"
    >
    </dialog-change-password>
    <v-menu
      v-model="menu"
      transition="slide-x-transition bottom"
      offset-y
      min-width="250"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          flat
          v-on="on"
          style="text-transform: none"
          class="grey--text text--lighten-2"
        >
          <v-icon class="pr-2">person</v-icon>
          <template v-if="getAccount">
            {{ getAccount }}
          </template>
          <v-icon small class="pl-2">arrow_drop_down</v-icon>
        </v-btn>
      </template>

      <v-card subheader class="pt-1 mb-1" elevation="1">
        <v-card-title class="pt-2 pb-0">
          <v-icon medium class="pr-2">account_box</v-icon>
          <b class="grey--text text--darken-3">{{ getAccount }}</b>
          <v-spacer></v-spacer
          ><v-btn
            @click="menu = false"
            flat
            icon
            class="ma-0"
            style="height: 24px; width: 24px;"
          >
            <v-icon small>close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text class="grey--text pt-1 pb-2 pl-5" style="font-size: 12px">
          <template v-if="$config.USE_I18N">
            <v-icon size="14px" class="pr-1 grey--text">language</v-icon
            >{{ $t(selectedLang.displayName) }}
          </template>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>

      <!--NOTE: LDAP模式下，無變更密碼功能-->
      <template v-if="isLdapMode === false">
        <v-list subheader class="pt-1 mb-1">
          <v-subheader class="my-1 pl-2"
            ><v-icon small class="pr-1">settings</v-icon
            >{{ $t('toolbar.personalSetting.title') }}</v-subheader
          >
          <v-list-tile @click="dialogUserProfileState = true" class="px-2">
            {{ $t('toolbar.personalSetting.selection_profile') }}
          </v-list-tile>
          <v-list-tile @click="dialogChangePasswordState = true" class="px-2">
            {{ $t('toolbar.personalSetting.selection_changePassword') }}
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
      </template>

      <template v-if="$config.USE_I18N">
        <v-list subheader class="pt-1 mb-1">
          <v-subheader class="my-1 pl-2">
            <v-icon small class="pr-1">language</v-icon
            >{{ $t('toolbar.personalSetting.language.title') }}</v-subheader
          >
          <v-list-tile
            v-for="item in langs"
            :key="item.value"
            @click="selectedLang = item"
            class="px-2"
          >
            {{ item.displayName }}
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
      </template>

      <v-list subheader class="pt-2">
        <v-list-tile @click="logout" class="primary--text px-2">
          <b>{{ $t('toolbar.personalSetting.selection_logout') }}</b>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import DialogUserProfile from '@/components/navigation/DialogUserProfile';
import DialogChangePassword from '@/components/navigation/DialogChangePassword';
import alertUtil from '@/utils/alertUtil.js';
import {
  getDecryptLocalStorage,
  getDecryptLocalStorageStringData
} from '@/utils/processLocalStorage';
import { apiLogout } from '@/api/apiClient/login';

export default {
  components: {
    DialogUserProfile,
    DialogChangePassword
  },

  data() {
    return {
      dialogUserProfileState: false,
      dialogChangePasswordState: false,
      menu: false,
      langs: this.$config.LANGS,
      selectedLang: null
    };
  },

  computed: {
    ...mapGetters({
      getLanguage: 'i18nStore/getLang',
      getNeedUpdatePassword: 'getNeedUpdatePassword'
    }),
    getAccount() {
      return getDecryptLocalStorageStringData('account');
    },
    isLdapMode() {
      return getDecryptLocalStorage('uiConfig').isLdapMode;
    }
  },

  watch: {
    selectedLang(val) {
      if (val) {
        this.changeLang(val.value);
      }
    }
  },

  created() {
    if (getDecryptLocalStorage('uiConfig') === null) {
      alertUtil.loginAgain();
    }
    this.selectedLang = this.langs.find(
      item => item.value === this.getLanguage
    );
  },

  methods: {
    ...mapMutations({
      changeLang: 'i18nStore/changeLang'
    }),

    async logout() {
      try {
        await apiLogout();
      } finally {
        localStorage.removeItem('x-csrf-token');
        this.$router.push('/');
      }
    }
  },

  mounted() {
    if (this.getNeedUpdatePassword) this.dialogChangePasswordState = true;
  }
};
</script>

<style lang="scss" scoped>
.v-menu__content ::v-deep {
  background-color: white;
  top: 75px !important;

  .v-subheader {
    font-size: 12px;
    height: 20px;
  }

  .v-list__tile {
    font-size: 14px;
    height: 35px;
  }
}
</style>
