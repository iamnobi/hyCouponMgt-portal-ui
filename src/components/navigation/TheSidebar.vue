<template>
  <v-navigation-drawer
    clipped
    app
    stateless
    v-model="drawer"
    value="true"
    class="pt-3"
  >
    <v-list class="menu mt-1">
      <template v-for="(item, index) in menu">
        <v-list-group
          v-if="item.show"
          :key="index"
          :prepend-icon="item.icon"
          :append-icon="item.link ? '' : $vuetify.icons.expand"
          no-action
        >
          <template v-slot:activator>
            <v-list-tile :to="item.link">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>

          <template v-for="(subItem, subIndex) in item.subMenus">
            <!-- dont have submenu -->
            <v-list-tile
              v-if="!subItem.subMenus && subItem.show"
              :key="subIndex"
              :to="subItem.link"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <!-- have submenu -->
            <v-list-group
              v-else-if="subItem.subMenus && subItem.show"
              :key="subIndex"
              :prepend-icon="subItem.icon"
              :sub-group="subItem.subMenus !== null"
              no-action
            >
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>

              <template
                v-for="(grandSubItem, grandSubIndex) in subItem.subMenus"
              >
                <v-list-tile
                  v-if="grandSubItem.show"
                  :key="grandSubIndex"
                  :to="grandSubItem.link"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ grandSubItem.title }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list-group>
          </template>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import alertUtil from '@/utils/alertUtil';
import { MenuItem } from '@/models/menu';

export default {
  name: 'ThePrimaryBankSidebar',

  props: {
    drawer: {
      type: Boolean
    }
  },

  data() {
    return {
      permission: null,
      issuerBankId: null,
      loading: false
    };
  },

  created() {
    // ! getDecryptLocalStorage() has side effect to return null
    if (getDecryptLocalStorage('uiConfig') === null) alertUtil.loginAgain();

    if (getDecryptLocalStorage('permission') !== null)
      this.permission = getDecryptLocalStorage('permission');

    this.setInitialIssuerBankId();
  },

  computed: {
    userManagementSection() {
      return (
        this.permission.userGroupQuery ||
        this.permission.unlockQuery ||
        this.permission.mimaPolicyQuery ||
        this.permission.auditLogQuery
      );
    },

    systemSettingSection() {
      return (
        this.permission.sysBinRangeQuery || this.permission.generalSettingQuery
      );
    },

    menu() {
      return [
        new MenuItem(
          this.$t('menu.dashboard.title'),
          '/dashboard/statisticReport',
          'pie_chart',
          this.permission.reportQuery
        ),
        new MenuItem(
          this.$t('menu.transaction.title'),
          '',
          'description',
          this.permission.txQuery,
          [
            new MenuItem(
              this.$t('menu.transaction.sub.records'),
              '/transaction/records',
              '',
              this.permission.txQuery
            ),
            new MenuItem(
              this.$t('menu.transaction.sub.preqRecords'),
              '/transaction/preqRecords',
              '',
              this.permission.txQuery
            )
          ]
        ),
        new MenuItem(
          this.$t('menu.issuer.title'),
          '',
          'credit_card',
          this.permission.bankManageQuery,
          [
            new MenuItem(
              this.$t('menu.issuer.sub.issuerManage'),
              '/issuer/issuerManage',
              '',
              this.permission.bankManageQuery
            )
          ]
        ),
        new MenuItem(
          this.$t('menu.acquirer.title'),
          '',
          'account_balance',
          this.permission.acquirerBankQuery,
          [
            new MenuItem(
              this.$t('menu.acquirer.sub.acquirerManage'),
              '/acquirer/acquirerManage',
              '',
              this.permission.acquirerBankQuery
            ),
            new MenuItem(
              this.$t('menu.acquirer.sub.3dsSdk'),
              '/acquirer/threedsSdk',
              '',
              this.permission.acquirerBankQuery
            )
          ]
        ),
        new MenuItem(
          this.$t('menu.account.title'),
          '',
          'group',
          this.userManagementSection,
          [
            new MenuItem(
              this.$t('menu.account.sub.groupPermission'),
              '/accountManagement/roleGroup',
              '',
              this.permission.userGroupQuery
            ),
            new MenuItem(
              this.$t('menu.account.sub.userManage'),
              '/accountManagement/userManage',
              '',
              this.permission.userGroupQuery
            ),
            new MenuItem(
              this.$t('menu.account.sub.userUnLock'),
              '/accountManagement/userUnlock',
              '',
              this.permission.unlockQuery
            ),
            new MenuItem(
              this.$t('menu.account.sub.passwordPrinciple'),
              '/accountManagement/passwordPrinciple',
              '',
              this.permission.mimaPolicyQuery
            ),
            new MenuItem(
              this.$t('menu.account.sub.auditLog'),
              '/accountManagement/auditLog',
              '',
              this.permission.auditLogQuery
            )
          ]
        ),
        new MenuItem(
          this.$t('menu.systemSetting.title'),
          '',
          'settings',
          this.systemSettingSection,
          [
            new MenuItem(
              this.$t('menu.systemSetting.sub.general'),
              '/systemSetting/general',
              '',
              this.permission.generalSettingQuery
            ),
            new MenuItem(
              this.$t('menu.systemSetting.sub.mcc'),
              '/systemSetting/mcc',
              '',
              this.permission.generalSettingQuery
            ),
            new MenuItem(
              this.$t('menu.systemSetting.sub.binRange'),
              '/systemSetting/binRange',
              '',
              this.permission.sysBinRangeQuery
            )
          ]
        ),
        new MenuItem(
          this.$t('menu.certificate.title'),
          '',
          'vpn_key',
          this.permission.certQuery,
          [
            new MenuItem(
              this.$t('menu.certificate.sub.ca'),
              '/certificate/CA',
              '',
              this.permission.certQuery
            ),
            new MenuItem(
              this.$t('menu.certificate.sub.deviceInfo'),
              '/certificate/DeviceInfo',
              '',
              this.permission.certQuery
            ),
            new MenuItem(
              this.$t('menu.certificate.sub.ssl'),
              '/certificate/SSL',
              '',
              this.permission.certQuery
            )
          ]
        )
      ];
    }
  },

  methods: {
    setInitialIssuerBankId() {
      this.issuerBankId = getDecryptLocalStorage('issuerBankId');
    }
  }
};
</script>

<style lang="scss" scoped>
.menu /deep/ {
  .v-list__tile {
    height: unset;
    min-height: 48px;
  }
  .v-list__tile__title {
    height: unset;
    min-height: 48px;
    line-height: 48px;
  }

  [role='listitem'] {
    .v-list__tile__content {
      overflow: unset;
      cursor: pointer;
    }
  }
}
</style>
