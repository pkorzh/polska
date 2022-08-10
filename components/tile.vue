<template>
  <div
    class="card"
  >
    <div class="card-image-holder">
      <n-link
        class="mask"
        :to="{ name: 'tile-id', params: { id: tile.id }}"
      >
        <img class="card-image"
             :src="mediaUrl(tile)"
             :srcset="`${mediaUrl(tile, 320)} 1x,
                     ${mediaUrl(tile, 480)} 2x,
                     ${mediaUrl(tile, 720)} 3x,
                     ${mediaUrl(tile, 1280)} 4x,`"
            @load="() => imgLoadingStatus = IMG_STATUS_OK"
            @error="() => imgLoadingStatus = IMG_STATUS_ERROR"
        />
        <div class="card-image-placeholder" v-if="imgLoadingStatus === IMG_STATUS_LOADING || imgLoadingStatus === IMG_STATUS_ERROR">
          <fa :icon="['fas', 'spinner']" v-if="tile.image && imgLoadingStatus === IMG_STATUS_LOADING" />
          <fa :icon="['fas', 'exclamation']" v-if="tile.image && imgLoadingStatus === IMG_STATUS_ERROR" />
        </div>
      </n-link>


      <!--<soundtracks :tile="tile" />-->
    </div>

    <div class="card-body">
      <div class="card-head">
        <n-link :to="{ name: 'tile-id', params: { id: tile.id }}" class="link">
          <h5 class="card-title">{{ tile.display_name }}</h5>
        </n-link>

        <button type="button" class="btn btn-icon" @click="show = !show">
          <fa :icon="['fas', 'ellipsis-h']" />
        </button>
      </div>
    </div>

    <tileOptionsModal v-model="show" @hide="show = false" :tile="tile" />
  </div>
</template>

<script>
import tileOptionsModal from "./tileOptionsModal";
import soundtracks from "./soundtracks";

import mediaUrlMixin from "@/mixins/mediaUrl";
import {imgLoadingStatuses} from '@/utils';

export default {
  components: {
    tileOptionsModal,
    soundtracks,
  },
  data: () => ({
    show: false,
    ...imgLoadingStatuses,
    imgLoadingStatus: imgLoadingStatuses.IMG_STATUS_LOADING,
  }),
  props: ["tile"],
  mixins: [mediaUrlMixin],
  methods: {
  }
};
</script>

<style>
</style>