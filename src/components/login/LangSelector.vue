<template>
  <div>
    <div
      class="d-inline-block"
      v-for="(item, index) in langs"
      :key="item.value"
    >
      <span @click="selectedLang = item" class="lang cursor-pointer">
        {{ item.displayName }}
      </span>
      <span class="font-13 separationLine" v-show="langs.length !== index + 1">
        |
      </span>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapMutations } = createNamespacedHelpers('i18nStore');

export default {
  data() {
    return {
      langs: this.$config.LANGS,
      selectedLang: null
    };
  },

  computed: {
    ...mapGetters(['getLang'])
  },

  watch: {
    selectedLang(val) {
      if (val) {
        this.changeLang(val.value);
      }
    }
  },

  created() {
    this.selectedLang = this.langs.find(item => item.value === this.getLang);
  },

  methods: {
    ...mapMutations(['changeLang'])
  }
};
</script>

<style lang="scss" scoped>
.separationLine {
  width: 30px;
  display: inline-block;
  text-align: center;
}

.lang {
  transition: color ease 0.3s;
  &:hover {
    color: #dfba5f;
  }
}
</style>
