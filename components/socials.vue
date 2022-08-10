<template>
    <ul class="list list--right">
        <li class="list-item" v-if="tile.facebook_id">
            <a :href="socialLink('https://www.facebook.com/', tile.facebook_id)" target="_blank" class="social-link">
                <fa :icon="['fab', 'facebook']" />
                <span class="social-link-text">{{ tile.facebook_id }}</span>
            </a>
        </li>
        <li class="list-item" v-if="tile.twitter_id">
            <a :href="socialLink('https://www.twitter.com/', tile.twitter_id)" target="_blank" class="social-link">
                <fa :icon="['fab', 'twitter']" />
                <span class="social-link-text">{{ tile.twitter_id }}</span>
            </a>
        </li>
        <li class="list-item" v-if="tile.instagram_id">
            <a :href="socialLink('https://www.instagram.com/', tile.instagram_id)" target="_blank" class="social-link">
                <fa :icon="['fab', 'instagram']" />
                <span class="social-link-text">{{ tile.instagram_id }}</span>
            </a>
        </li>
    </ul>
</template>

<script>
export default {
    props: ['tile'],
    methods: {
        socialLink(url, id) {
            return url + id;
        }
    }
}
</script>

<style>

</style>