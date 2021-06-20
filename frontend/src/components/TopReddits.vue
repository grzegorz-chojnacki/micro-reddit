<template>
  <section class="card mt-3">
    <header class="card-header">
      Top reddits by number of {{ title }}
    </header>

    <div class="card-body">
      <ol class="list-group list-group-numbered list-group-flush">
        <li
          v-for="reddit in reddits"
          :key="reddit.id"
          class="list-group-item d-flex">
          <router-link
            class="text-decoration-none flex-grow-1 mx-1"
            :to="{ name: 'reddit', params: { redditName: reddit.name }}">
            {{ reddit.name }}
          </router-link>
          {{ reddit.count }}
        </li>
      </ol>
    </div>
  </section>
</template>

<script>
export default {
  name: "TopReddits",
  props: {
    title: { type: String, required: true },
    fetchingFn: { type: Function, required: true },
  },
  data() {
    return {
      reddits: [],
    };
  },
  async created() {
    this.reddits = await this.fetchingFn();
  }
};
</script>
