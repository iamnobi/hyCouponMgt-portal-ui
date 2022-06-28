<template>
  <span>
    <v-btn
      round
      :disabled="disableDeleteBtn"
      :outline="btnOutline"
      :color="this.icon ? 'transplate' : color"
      :icon="icon"
      :small="small"
      @click.stop="deleteAlert"
    >
      <slot><v-icon :color="color"> delete </v-icon></slot>
    </v-btn>
  </span>
</template>

<script>
import { confirmDelete } from '@/mixins/alertTextCollection';

export default {
  mixins: [confirmDelete],

  props: {
    color: {
      type: String,
      default: 'red'
    },
    icon: {
      type: Boolean,
      default: true
    },
    disableDeleteBtn: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    btnOutline() {
      return this.icon ? false : true;
    }
  },

  methods: {
    deleteAlert() {
      this.$swal(this.confirmDelete)
        .then(result => {
          if (result.value) {
            this.$emit('allow-delete');
          }
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
