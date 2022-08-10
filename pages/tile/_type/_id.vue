<template>
  <div class="details-layout">
    <div class="details-layout__preview">
      <div class="details-layout__preview-image">
        <img
          v-if="head.image"
          :src="mediaUrl(head.image, 720)"
          :srcset="`${mediaUrl(head.image, 720)} 1x, ${mediaUrl(head.image, 1280)} 2x`"
          @load="() => imgLoadingStatus = IMG_STATUS_OK"
          @error="() => imgLoadingStatus = IMG_STATUS_ERROR"
        />
      </div>

      <div class="details-layout__preview-text">
        <div class="details-layout__preview-title">
          <template v-if="head.type == 'still_frame'">
            <h1>
              {{ head.persons }}
              <small class="muted">in</small>
              {{ head.display_name }}
            </h1>
          </template>
          <template v-else-if="head.type == 'photo'">
            <h1>
              <small class="muted">photo of</small>
              <n-link :to="{ name: 'tile-type-id', params: { type: 'person', id: head.person_id }}">
                {{head.display_name}}
              </n-link>
            </h1>
          </template>
          <template v-else-if="head.type == 'title'">
            <h1>
              {{ head.display_name }}
              <small class="muted">{{ head.year }}</small>
            </h1>
          </template>
          <template v-else>
            <h1>{{ head.display_name }}</h1>
          </template>

          <button type="button" class="btn btn-icon" @click="show = !show">
            <fa :icon="['fas', 'ellipsis-h']" />
          </button>
        </div>

        <template v-if="head.display_name2">
          <small class="d-block muted">{{ head.display_name2 }}</small>
        </template>

        <div class="details-layout__preview-tagline" v-if="head.tagline">
          {{ head.tagline }}
        </div>

        <div class="details-layout__preview-socials" v-if="hasSocial(head)">
          <socials :tile="head" />
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
            <n-link :to="{ name: 'tile-type-id', params: { type: 'genre', id: genre.slug }}">
              #{{ genre.name }}
            </n-link>
          </p>
        </div>

        <div class="details-layout__preview-tags" v-if="head.type == 'person'">
          <p v-if="head.birthday" class="d-inline">{{ head.birthday }}</p>

          <p class="d-inline" v-if="head.place_of_birth">
            <template v-if="head.location_id">
              <n-link :to="{ name: 'tile-type-id', params: { type: 'location', id: head.location_id }}">
                #{{head.place_of_birth}}
              </n-link>
            </template>
            <template v-else>
              #{{head.place_of_birth}}
            </template>
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

      <button class="d-block mx-auto btn btn-light" @click="tailLoadMore" v-if="tailHasMore" :disabled="isTailLoading">
        Load more
      </button>

      <hr />

      <tiles :tiles="rest" />

      <infinite-loading @infinite="infiniteHandler" :distance="1000"></infinite-loading>
    </client-only>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import mediaUrlMixin from "@/mixins/mediaUrl";
import soundtracks from "@/components/soundtracks";
import tiles from "@/components/tiles.vue";
import tileOptionsModal from "@/components/tileOptionsModal";
import socials from "@/components/socials";
import { imgLoadingStatuses } from "@/utils";

export default {
  data() {
    return {
      head: {
		id: 1,
		imdb_id: '123',
		year: 2022,
		genres: [
			{ name: 'a', slug: 'a' },
			{ name: 'b', slug: 'b' },
		],
		plot: {
			text: 'hello hello plot long text',
			author: 'plko'
		},
		tagline: 'die hard',
		display_name: 'Joker',
		image: 'https://m.media-amazon.com/images/M/MV5BYTNlOGZhYzgtMmE3OC00Y2NiLWFhNWQtNzg5MjRhNTJhZGVmXkEyXkFqcGdeQXVyNzg5MzIyOA@@._V1_UY1200_CR108,0,630,1200_AL_.jpg',
		type: 'title'
	  },
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
    const display_name = this.head.display_name;
    const image = this.mediaUrl(this.head.image, 480);
    let description;

      switch(this.head.type) {
        case 'title':
          const genres = this.head.genres || [];
          const tags = genres.map(g => `#${g.name}`).join(' ');
          description = `${this.head.tagline ? this.head.tagline : ''} ${tags}`;
          break;
        case 'still_frame':
          description = `${this.head.persons} in ${display_name}`;
          break;
        case 'photo':
          description = `photo of ${display_name}`;
          break;
        default:
          description = '';
      }

    return {
      title: display_name,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { property: 'og:title', content: display_name },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
      ]
    };
  },
  async fetch() {
    /*this.head = await this.$axios.$get(
      `/api/head/${this.$route.params.type}/${this.$route.params.id}/`
    );

    this.tail = await this.$axios.$get(
      `/api/tail/${this.$route.params.type}/${this.$route.params.id}/`, {
        params: { page: this.tailPage }
      }
    );*/
  },
  components: {
    tiles,
    tileOptionsModal,
    socials,
    soundtracks
  },
  computed: {
    ...mapGetters(["lastPage"])
  },
  mixins: [mediaUrlMixin],
  methods: {
    async tailLoadMore() {
      if (this.isTailLoading) {
        return
      }

      this.isTailLoading = true

      const newtail = await this.$axios.$get(
        `/api/tail/${this.$route.params.type}/${this.$route.params.id}/`, {
          params: { page: ++this.tailPage }
        }
      )

      if (!newtail.length) {
        this.tailHasMore = false
      }

      this.isTailLoading = false
      this.tail.push(...newtail)
    },

    hasSocial(tile) {
      return tile.facebook_id || tile.twitter_id || tile.instagram_id;
    },

    ...mapActions(["setLastPage"]),

    async infiniteHandler($state) {
      const data = await this.$axios.$get("/api", {
        params: { page: this.lastPage }
      });

      if (data.length) {
        this.rest.push(...data);
        this.setLastPage(this.lastPage + 1);
        $state.loaded();
      } else {
        $state.complete();
      }
    }
  }
};
</script>
