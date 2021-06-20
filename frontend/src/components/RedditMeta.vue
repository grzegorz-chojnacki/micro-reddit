<template>
  <div class="d-flex flex-column gap-3">
    <section class="card mt-3">
      <header class="card-header">
        <h5 class="card-title m-0">
          <router-link
            class="text-reset"
            :to="{
              name: 'reddit',
              params: { redditName: reddit.name },
            }">
            {{ reddit.name }}
          </router-link>
        </h5>
      </header>

      <div class="card-body">
        <p class="card-text">
          {{ reddit.description }}
        </p>
      </div>
    </section>

    <template v-if="isAuthenticated">
      <button v-if="reddit.subscribed" class="btn btn-secondary" @click="setSubscribe(false)">
        Unsubscribe
      </button>
      <button v-else class="btn btn-primary" @click="setSubscribe(true)">
        Subscribe
      </button>
    </template>

    <button v-if="isMod" class="btn btn-secondary" @click="openMetadataDialog">
      Change metadata
    </button>

    <section class="card">
      <header class="card-header">
        <h5 class="card-title m-0">
          Moderators
        </h5>
      </header>

      <ul class="list-group list-group-flush">
        <li v-for="mod of reddit.mods" :key="mod.id" class="list-group-item">
          {{ mod.username }}
        </li>
      </ul>
    </section>

    <button v-if="isMod" class="btn btn-secondary" @click="openModeratorDialog">
      Add a moderator
    </button>
  </div>
</template>

<script>
import { userService } from "@/services/userService";
import { dialogService } from "@/services/dialogService";
import MetadataDialog from "@/components/dialogs/MetadataDialog.vue";
import ModeratorDialog from "@/components/dialogs/ModeratorDialog.vue";

export default {
  name: "RedditMeta",
  props: { reddit: { type: Object, required: true } },
  emits: ["subscription", "update"],
  data() {
    return {
      subscription: null,
      user: null,
      isAuthenticated: false
    };
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
    this.subscription = userService.user.subscribe(user => {
      this.user = user;
      this.isAuthenticated = user !== null;
    });
  },
  unmounted() {
    this.subscription.unsubscribe();
  },
  methods: {
    setSubscribe(state) {
      this.$emit("subscription", state);
    },
    openMetadataDialog() {
      dialogService
        .open(MetadataDialog, { ...this.reddit })
        .then(() => this.$emit("update"));
    },
    openModeratorDialog() {
      dialogService
        .open(ModeratorDialog, { ...this.reddit })
        .then(() => this.$emit("update"));
    },
  },
};
</script>
