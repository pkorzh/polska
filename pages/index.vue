<template>
  <div class="main-layout">
    <client-only>
      <tiles :tiles="tiles" />

      <infinite-loading @infinite="infiniteHandler" :distance="1000"></infinite-loading>
    </client-only>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Tiles from "@/components/tiles.vue";

export default {
  data() {
    return {
      tiles: []
    };
  },
  async fetch() {
    this.tiles = await this.$axios.$get(`${process.env.apiRoot}/`);
    this.setLastPage(1);
  },
  components: {
    tiles: Tiles
  },
  computed: {
    ...mapGetters(["lastPage"])
  },
  methods: {
    ...mapActions(["setLastPage"]),
    async infiniteHandler($state) {
      const data = await this.$axios.$get(`${process.env.apiRoot}/`, {
        params: { page: this.lastPage }
      });
	  return;
      if (data.length) {
        this.tiles.push(...data);
        this.setLastPage(this.lastPage + 1);
        $state.loaded();
      } else {
        $state.complete();
      }
    }
  }
};
</script>
