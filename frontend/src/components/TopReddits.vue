<template>
  <div class="d-flex flex-column gap-3">
    <section class="card mt-3">
      <header class="card-header">
        Top reddits by number of users
      </header>

      <div class="card-body">
        <ol class="list-group list-group-numbered list-group-flush">
          <li
            v-for="reddit in redditsByUsers"
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

    <section class="card">
      <header class="card-header">
        Top reddits by number of posts
      </header>

      <div class="card-body">
        <ol class="list-group list-group-numbered list-group-flush">
          <li
            v-for="reddit in redditsByPosts"
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
  </div>
</template>

<script>
import { redditService } from "@/services/redditService";

export default {
  name: "TopReddits",
  data() {
    return {
      redditsByPosts: [],
      redditsByUsers: [],
    };
  },
  async mounted() {
    this.redditsByPosts = await redditService.getTopByPosts();
    this.redditsByUsers = await redditService.getTopByUsers();
  }
};
</script>
