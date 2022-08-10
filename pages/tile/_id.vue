<template>
  <div class="details-layout">
    <div class="details-layout__preview">
      <div class="details-layout__preview-image">
        <img
          v-if="head.id"
          :src="mediaUrl(head, 720)"
          :srcset="`${mediaUrl(head, 720)} 1x, ${mediaUrl(head, 1280)} 2x`"
          @load="() => (imgLoadingStatus = IMG_STATUS_OK)"
          @error="() => (imgLoadingStatus = IMG_STATUS_ERROR)"
        />
      </div>

      <div class="details-layout__preview-text">
        <div class="details-layout__preview-title">
          <h1>{{ head.display_name }}</h1>

          <button type="button" class="btn btn-icon" @click="show = !show">
            <fa :icon="['fas', 'ellipsis-h']" />
          </button>
        </div>

        <div class="details-layout__preview-tagline">
          {{ head.tagline }}
        </div>

        <div class="details-layout__preview-plot" v-if="head.plot">
          <blockquote class="blockquote">
            <p class="mb-0">{{ head.plot.text }}</p>
            <footer class="blockquote-footer" v-if="head.plot.author">
              {{ head.plot.author }}
              <cite title="Source Title">imdb</cite>
            </footer>
          </blockquote>
        </div>

        <div class="details-layout__preview-tags" v-if="head.type == 'title'">
          <p class="d-inline" v-for="genre in head.genres" :key="genre.name">
            <n-link
              :to="{
                name: 'tile-type-id',
                params: { type: 'genre', id: genre.slug },
              }"
            >
              #{{ genre.name }}
            </n-link>
          </p>
        </div>

        <div class="details-layout__preview-tags" v-if="head.type == 'person'">
          <p v-if="head.birthday" class="d-inline">{{ head.birthday }}</p>

          <p class="d-inline" v-if="head.place_of_birth">
            <template v-if="head.location_id">
              <n-link
                :to="{
                  name: 'tile-type-id',
                  params: { type: 'location', id: head.location_id },
                }"
              >
                #{{ head.place_of_birth }}
              </n-link>
            </template>
            <template v-else> #{{ head.place_of_birth }} </template>
          </p>
        </div>

        <div class="details-layout__preview-tracks" v-if="head.type == 'album'">
          <soundtracks :tile="head" />
        </div>
      </div>
    </div>

    <tileOptionsModal v-model="show" @hide="show = false" :tile="head" />
    <client-only>
      <tiles :tiles="tail" />

      <button
        class="d-block mx-auto btn btn-light"
        @click="tailLoadMore"
        v-if="tailHasMore"
        :disabled="isTailLoading"
      >
        Load more
      </button>

      <hr />

      <tiles :tiles="rest" />

      <infinite-loading
        @infinite="infiniteHandler"
        :distance="1000"
      ></infinite-loading>
    </client-only>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import mediaUrlMixin from "@/mixins/mediaUrl";
import soundtracks from "@/components/soundtracks";
import tiles from "@/components/tiles.vue";
import tileOptionsModal from "@/components/tileOptionsModal";
import { imgLoadingStatuses } from "@/utils";

export default {
  data() {
    return {
      head: {},
      tail: [],
      rest: [],
      show: false,
      ...imgLoadingStatuses,
      imgLoadingStatus: imgLoadingStatuses.IMG_STATUS_LOADING,
      tailPage: 0,
      tailHasMore: true,
      isTailLoading: false,
    };
  },
  head() {
  },
  async fetch() {
    this.head = await this.$axios.$get(
      `${process.env.apiRoot}/${this.$route.params.id}/`
    );

    this.tail = await this.$axios.$get(
      `${process.env.apiRoot}/tail/${this.$route.params.id}/`, {
        params: { page: this.tailPage }
      }
    );
  },
  components: {
    tiles,
    tileOptionsModal,
    soundtracks,
  },
  computed: {
    ...mapGetters(["lastPage"]),
  },
  mixins: [mediaUrlMixin],
  methods: {
    async tailLoadMore() {
      if (this.isTailLoading) {
        return;
      }

      this.isTailLoading = true;

      const newtail = await this.$axios.$get(
        `${process.env.apiRoot}/tail/${this.$route.params.id}/`,
        {
          params: { page: ++this.tailPage },
        }
      );

      if (!newtail.length) {
        this.tailHasMore = false;
      }

      this.isTailLoading = false;
      this.tail.push(...newtail);
    },

    ...mapActions(["setLastPage"]),

    async infiniteHandler($state) {
      const data = await this.$axios.$get(`${process.env.apiRoot}/`, {
        params: { page: this.lastPage },
      });

      if (data.length) {
        this.rest.push(...data);
        this.setLastPage(this.lastPage + 1);
        $state.loaded();
      } else {
        $state.complete();
      }
    },
  },
};
</script>
