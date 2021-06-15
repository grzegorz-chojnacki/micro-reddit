<template>
  <section class="card">
    <div class="card-body">
      <h5 class="card-title d-flex justify-content-between">
        <router-link
          :to="{
            name: 'reddit',
            params: { redditId: reddit.id },
          }">
          {{ reddit.name }}
        </router-link>
        <button v-if="reddit.subscribed" class="btn p-0" @click="setSubscribe(false)">
          Unsubscribe
        </button>
        <button v-else class="btn p-0" @click="setSubscribe(true)">
          Subscribe
        </button>
      </h5>
      <p class="card-text">
        {{ reddit.description }}
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "Reddit",
  props: { reddit: { type: Object, required: true } },
  emits: ["subscription"],
  methods: {
    setSubscribe(state) {
      this.$emit("subscription", { redditId: this.reddit.id, state });
    }
  }
};
</script>

<style scoped lang="scss">
.card-body > * {
  a {
    text-decoration: none;
    color: initial;
  }
}
</style>