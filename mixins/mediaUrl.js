export default {
    methods: {
        mediaUrl(tile, w) {
            return `${process.env.mediaRoot}/image/${w || 480}/${tile.id}.jpg`
        }
    }
}
