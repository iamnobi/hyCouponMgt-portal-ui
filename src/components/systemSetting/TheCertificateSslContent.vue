<template>
  <div>
    <div
      class="grey lighten-4  py-3 px-2 my-2"
      v-if="
        Object.values(certificateData).length && certificateData.applyMillis
      "
    >
      <table class="width100">
        <tbody>
          <tr>
            <td class="pa-2 grey--text text--darken-1" width="25%">
              {{ $t('page.certificate_ssl.setting.th_effectiveDate') }}
            </td>
            <td class="pa-2">
              {{ certificateData.applyMillis | convertTimeToSecond }}
            </td>
          </tr>
          <tr>
            <td class="pa-2 grey--text text--darken-1" width="25%">
              {{ $t('page.certificate_ssl.setting.th_information') }}
            </td>
            <td class="pa-2">{{ certificateData.certificateInformation }}</td>
          </tr>
          <tr>
            <td class="pa-2 grey--text text--darken-1" width="25%">
              {{ $t('page.certificate_ssl.setting.th_institution') }}
            </td>
            <td class="pa-2">{{ certificateData.issuer }}</td>
          </tr>
          <tr>
            <td class="pa-2 grey--text text--darken-1" width="25%">
              {{ $t('page.certificate_ssl.setting.th_expiryDate') }}
            </td>
            <td class="pa-2">
              {{ certificateData.expireMillis | convertTimeToSecond }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="grey lighten-4  grey--text text--darken-1 text-xs-center py-3 px-2 my-2"
    >
      {{ $t('page.certificate_ssl.setting.td_noCertificate') }}
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
