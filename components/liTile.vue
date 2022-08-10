<template>
  <div class="card-list">
      <a
          :key="index"
          :href="link"
          v-for="({ display_name, image, link }, index) in tile.items"
          :class="{ 'card-list__item--with-image': image }"
          class="card-list__item">
          <div class="card-list__item-image"
               v-if="image"
               :style="{ 'background-image': `url(${image})` }"
          />
          <div class="card-list__item-title">
              {{ display_name }}
          </div>
      </a>
  </div>
</template>

<script>
export default {
    props: ["tile"]
}
</script>

<style>

</style>