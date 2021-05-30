<template>
  <div class="d-flex flex-column gap-3">
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

    <button v-if="isMod" class="btn btn-secondary">
      Change metadata
    </button>

    <section class="card">
      <header class="card-header">
        <h5 class="card-title">
          Moderators
        </h5>
      </header>

      <ul class="list-group list-group-flush">
        <li v-for="mod of reddit.mods" :key="mod.id" class="list-group-item">
          {{ mod.name }}
        </li>
      </ul>
    </section>

    <button
      v-if="isMod"
      class="btn btn-secondary"
      data-bs-toggle="modal"
      data-bs-target="#moderatorDialog">
      Add a moderator
    </button>
  </div>
</template>

<script>
import { userService } from "@/services/userService";

export default {
  name: "Reddit",
  props: { reddit: { type: Object, required: true } },
  data() {
    return { user: null };
  },
  computed: {
    isMod() {
      if (this.user) {
        return this.reddit.mods.some(mod => mod.id === this.user.id);
      } else {
        return false;
      }
    }
  },
  created() {
    userService.user.subscribe(user => this.user = user);
  },
};
</script>

<style scoped lang="scss">
header > * {
  a {
    text-decoration: none;
    color: initial;
  }
}
</style>