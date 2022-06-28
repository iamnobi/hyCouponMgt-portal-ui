import i18n from '@/plugins/i18n';

function allModuleGroups() {
  i18n.locale = localStorage.getItem('lang');
  return [
    {
      moduleName: 'moduleCanSeePan',
      name: i18n.t('menu.canSeePan.module.canSeePan'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'canSeePanQuery'
        }
      ]
    },
    {
      moduleName: 'moduleReport',
      name: i18n.t('menu.dashboard.module.report'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'reportQuery'
        }
      ]
    },
    {
      moduleName: 'moduleTx',
      name: i18n.t('menu.transaction.module.records'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'txQuery'
        }
      ]
    },
    {
      moduleName: 'moduleBankManage',
      name: i18n.t('menu.issuer.module.issuerManage'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'bankManageQuery'
        },
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_edit'
          ),
          action: 'bankManageModify'
        }
      ]
    },
    {
      moduleName: 'moduleAcquirerBank',
      name: i18n.t('menu.acquirer.module.acquirer'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'acquirerBankQuery'
        },
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_edit'
          ),
          action: 'acquirerBankModify'
        }
      ]
    },
    {
      moduleName: 'moduleUserGroup',
      name: i18n.t('menu.account.module.userManage'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'userGroupQuery'
        },
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_edit'
          ),
          action: 'userGroupModify'
        }
      ]
    },
    {
      moduleName: 'moduleUserUnlock',
      name: i18n.t('menu.account.module.userUnLock'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'unlockQuery'
        },
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_edit'
          ),
          action: 'unlockModify'
        }
      ]
    },
    {
      moduleName: 'moduleMimaPolicy',
      name: i18n.t('menu.account.module.passwordPrinciple'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'mimaPolicyQuery'
        },
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_edit'
          ),
          action: 'mimaPolicyModify'
        }
      ]
    },
    {
      moduleName: 'moduleUserAuditLog',
      name: i18n.t('menu.account.module.auditLog'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'auditLogQuery'
        }
      ]
    },
    {
      moduleName: 'moduleGeneralSetting',
      name: i18n.t('menu.systemSetting.module.general'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'generalSettingQuery'
        },
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_edit'
          ),
          action: 'generalSettingModify'
        }
      ]
    },
    {
      moduleName: 'moduleSysBinRange',
      name: i18n.t('menu.systemSetting.module.binRange'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'sysBinRangeQuery'
        },
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_edit'
          ),
          action: 'sysBinRangeModify'
        }
      ]
    },
    {
      moduleName: 'moduleCert',
      name: i18n.t('menu.certificate.module.certificate'),
      permissions: [
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_view'
          ),
          action: 'certQuery'
        },
        {
          name: i18n.t(
            'page.account_groupPermission.permissionSetting.switch_edit'
          ),
          action: 'certModify'
        }
      ]
    }
  ];
}
export default allModuleGroups;
