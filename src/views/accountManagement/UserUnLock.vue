<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.account.sub.userUnLock') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.account_userUnLock.description') }}
      </template>
    </base-page-title>

    <the-user-table />
  </v-layout>
</template>

<script>
import TheUserTable from '@/components/accountManagement/TheUserTable.vue';

export default {
  components: {
    TheUserTable
  }
};
</script>
