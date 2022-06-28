<template>
  <v-toolbar v-bind="$attrs" card app clipped-left>
    <v-toolbar-side-icon
      class="grey--text text--lighten-2"
      @click.native="changeDrawerState"
    ></v-toolbar-side-icon>

    <template>
      <div class="title ml-2">
        <img
          :src="dsLogoPath"
          alt="DS Logo"
          style="max-height: 45px; width: 70px;"
        />
      </div>
      <span
        class="grey--text text--lighten-2 ml-1 pt-2 pl-1"
        style="font-size: 16px"
        ><b>{{ $t('toolbar.system') }}</b></span
      >
    </template>

    <v-spacer></v-spacer>

    <div class="pr-3 d-flex align-center" style="line-height: 20px">
      <span class="px-2 grey--text text--lighten-2">{{
        $t('toolbar.timeLeft')
      }}</span>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="extendLoginTime"
            round
            outline
            class="grey--text text--lighten-2"
          >
            <v-icon color="grey--text text--lighten-2" class="pr-2" small
              >alarm_add</v-icon
            >
            <span class="grey--text text--lighten-2" style="font-size: 18px">{{
              counter | formatCounter
            }}</span>
          </v-btn>
        </template>
        <span>{{ $t('toolbar.tip_loginExtend') }}</span>
      </v-tooltip>
    </div>

    <span class="pr-1 pl-2 grey--text text--lighten-1">|</span>

    <personal-setting></personal-setting>
  </v-toolbar>
</template>

<script>
import PersonalSetting from '@/components/navigation/PersonalSetting';

import '@/eventBus/bus';
import moment from 'moment';
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import { idleTimer } from '@/utils/inactivity.js';
import alertUtil from '@/utils/alertUtil.js';
import { confirmLoginExpiring } from '@/mixins/alertTextCollection';
import { apiGetAccountPermission } from '@/api/apiClient/permission';

export default {
  components: {
    PersonalSetting
  },

  mixins: [confirmLoginExpiring],

  filters: {
    formatCounter(val) {
      return val !== null ? moment(val).format('mm:ss') : '';
    }
  },

  data() {
    return {
      counter: null
    };
  },

  computed: {
    isMultipleBank() {
      return getDecryptLocalStorage('uiConfig').isMultipleBank;
    },
    dsLogoPath() {
      return this.$config.LOGO_TOOLBAR_PATH;
    }
  },

  watch: {
    counter(val) {
      if (val === 1 * 60 * 1000 || val === 2 * 60 * 1000) {
        this.$swal(this.confirmLoginExpiring).then(result => {
          if (result.value) {
            this.extendLoginTime();
          }
        });
      }
    }
  },

  created() {
    if (getDecryptLocalStorage('uiConfig') === null) {
      alertUtil.loginAgain();
    }

    // 重新reload page 會重新計時
    this.extendLoginTime();
    this.getTimerTime();
  },

  methods: {
    getTimerTime() {
      this.$bus.$on('sentTimer', remendTime => {
        this.counter = remendTime;
      });
    },

    extendLoginTime() {
      apiGetAccountPermission();

      // 會重新計時
      idleTimer();
    },

    changeDrawerState() {
      this.$emit('change-drawer-state');
    }
  }
};
</script>

<style lang="scss" scoped>
.v-toolbar ::v-deep {
  background: $Tool-Bar-Color;
  border-bottom: 1px solid #d8d8d8 !important;
  box-shadow: 0 3px 5px rgba(220, 220, 220, 0.4);
}

.v-toolbar--clipped ::v-deep {
  z-index: 30;
}
</style>
