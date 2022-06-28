<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <v-icon size="60" color="error">error_outline</v-icon>
      </v-flex>
      <v-flex xs12>
        <h2 class="grey--text text--darken-2">
          {{ $t('page.noPermission.message') }}
        </h2>
      </v-flex>
    </v-layout>
  </v-container>
</template>
