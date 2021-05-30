<template>
  <section class="card mt-3">
    <header class="card-header">
      <h5 class="card-title">
        <router-link
          :to="{
            name: 'reddit',
            params: { redditId: reddit.id },
          }">
          {{ reddit.name }}
        </router-link>
      </h5>
      <h6 class="card-subtitle">
        community
      </h6>
    </header>
    <div class="card-body">
      <p class="card-text">
        {{ reddit.text }}
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "Reddit",
  props: { reddit: { type: Object, required: true } },
};
</script>

<style scoped lang="scss">
section {
  max-width: 400px;
}

header > * {
  a {
    text-decoration: none;
    color: initial;
  }
}
</style>