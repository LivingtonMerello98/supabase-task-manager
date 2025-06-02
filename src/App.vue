<script>
export default {
  name: 'App'
}
</script>

<template>
  <section class="section">
    <router-view />
  </section>
</template>

<style lang="scss" scoped>
@use 'src/assets/partials/mixin' as*;
@use 'src/assets/partials/variables' as*;

.section {
  background-color:$custom-primary-color;
}
</style>
