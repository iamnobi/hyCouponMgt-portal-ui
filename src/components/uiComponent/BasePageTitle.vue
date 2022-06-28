<template>
  <v-flex xs12>
    <v-toolbar flat class="mb-3" color="transparent">
      <div>
        <v-toolbar-title class="ml-0">
          <slot name="pageTitle">Search</slot>
        </v-toolbar-title>
        <v-subheader class="px-0 mt-1" style="height: auto">
          <slot name="pageDescription"></slot>
        </v-subheader>
      </div>
    </v-toolbar>
  </v-flex>
</template>
