<template>
    <masonry
            class="tiles"
            :cols="{default: 5, 1100: 4, 800: 3, 680: 2, 370: 1}"
            :gutter="{default: '10px', 680: '5px'}"
    >
        <component :is="is(tile)" class="tile" v-for="(tile, index) in tiles" :key="index" :tile="tile" />
    </masonry>
</template>

<script>
import tile from './tile'
import liTile from './liTile'

export default {
    props: ['tiles'],
    components: {
        tile,
        liTile,
    },
    methods: {
        hasSocial(tile) {
            return tile.facebook_id || tile.twitter_id || tile.instagram_id;
        },
        is(tile) {
            if (tile.type == 'li') {
                return 'liTile'
            }
            return 'tile'
        }
    }
}
</script>

<style lang="scss">
    .tiles {
        > div {
            > div {
                margin-bottom: 10px;
            }
        }
    }
</style>
