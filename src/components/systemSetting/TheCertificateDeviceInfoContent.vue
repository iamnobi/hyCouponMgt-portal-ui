<template>
  <div>
    <div
      v-if="certificateData === null || certificateData.isExpire"
      class="grey lighten-4  grey--text text--darken-1 text-xs-center py-3 px-2 my-2"
    >
      {{ $t('page.certificate_deviceInfo.setting.td_noCertificate') }}
    </div>

    <div v-else class="grey lighten-4  py-3 px-2 my-2">
      <table class="width100">
        <tbody>
          <tr v-if="certificateData.applyDate">
            <td class="pa-2 grey--text text--darken-1" width="25%">
              {{ $t('page.certificate_deviceInfo.setting.th_effectiveDate') }}
            </td>
            <td class="pa-2 word-break">
              {{ certificateData.applyDate | convertTimeToSecond }}
            </td>
          </tr>
          <tr v-if="certificateData.expireDate">
            <td class="pa-2 grey--text text--darken-1" width="25%">
              {{ $t('page.certificate_deviceInfo.setting.th_expiryDate') }}
            </td>
            <td class="pa-2 word-break">
              {{ certificateData.expireDate | convertTimeToSecond }}
            </td>
          </tr>
          <tr v-if="certificateData.certificateInformation">
            <td class="pa-2 grey--text text--darken-1" width="25%">
              {{ $t('page.certificate_deviceInfo.setting.th_information') }}
            </td>
            <td class="pa-2 word-break">
              {{ certificateData.certificateInformation }}
            </td>
          </tr>
          <tr v-if="certificateData.issuer">
            <td class="pa-2 grey--text text--darken-1" width="25%">
              {{ $t('page.certificate_deviceInfo.setting.th_institution') }}
            </td>
            <td class="pa-2 word-break">{{ certificateData.issuer }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    certificateData: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.word-break {
  word-break: break-all;
}
</style>
