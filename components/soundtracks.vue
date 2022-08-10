<template>  
    <div class="soundtracks">
        <p>
            Available on <a :href="albumUrl(tile)" target="_blank">Deezer</a>
        </p>
        <ul class="list list--group">
            <li class="list-item" v-for="track in items" :key="track.id">
                <button type="button" class="list-item-btn btn btn-link" @click="play(track)" :disabled="!track.preview_url">
                <fa :icon="buttonIcon(track)" />
                </button>
                <div class="list-item-text">
                {{ track.title }}
                <small>{{ track.deezer_artist_name }}</small>
                </div>
            </li>
        </ul>
        <button
                class="btn-more"
                :class="{'hide': show}"
                v-if="tile.tracks.length > 5"
                @click="clickButton"
        >
            {{ buttonText }}
        </button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data: () => ({
      show: false,
      count: 5
    }),
    props: ['tile'],
    computed: {
      ...mapGetters([
        'nowPlaying',
      ]),
      buttonText() {
        return this.show ? 'Hide' : 'Show more'
      },
      items() {
        return this.tile.tracks.slice(0, this.count)
      }
    },
    methods: {
      ...mapActions([
        'setPlaying',
      ]),
      albumUrl(tile) {
        return tile.deezer_link
      },
      isPlaying(track) {
        return this.nowPlaying === track.id
      },
      buttonIcon(track) {
        if (this.isPlaying(track)) {
          return ['fas', 'pause']
        } else {
          return ['fas', 'play']
        }
      },
      play(track) {
        if (window.__audio) {
          window.__audio.pause()
          window.__audio = null
        }

        if (this.isPlaying(track)) {
          this.setPlaying(0)
        } else {
          this.setPlaying(track.id)
          window.__audio = new Audio(track.preview_url);
          window.__audio.play();
        }
      },
      hideItems() {
        this.show = false
        this.count = 5
      },
      showItems() {
        this.show = true
        this.count = this.tile.tracks.length
      },
      clickButton() {
        this.show ? this.hideItems() : this.showItems()
      }
    }
}
</script>

<style>

</style>