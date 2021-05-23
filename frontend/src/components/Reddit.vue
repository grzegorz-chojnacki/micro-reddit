<template>
  <section class="card">
    <div class="card-body">
      <h5 class="card-title">
        <router-link :to="{
            name: 'reddit',
            params: { redditId: reddit.id }}">
          {{ reddit.name }}
        </router-link>
      </h5>
      <p class="card-text">{{ reddit.text }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Reddit',
  props: {
    reddit: Object
  }
}
</script>

<style scoped lang="scss">
  .card-body > * {
    a {
      text-decoration: none;
      color: initial;
    }
  }
</style>