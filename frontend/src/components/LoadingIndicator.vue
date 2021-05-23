<template>
  <section class="d-flex justify-content-center my-5">
    <div v-if="!done">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <p><em>That's it</em></p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LoadingIndicator',
  props: { done: Boolean }
}
</script>

<style lang="scss" scoped>
em { opacity: 0.5 }
</style>
