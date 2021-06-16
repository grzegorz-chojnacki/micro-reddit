<template>
  <nav class="card bg-light mt-3">
    <div class="card-body p-2 d-flex justify-content-between">
      <div class="d-flex align-items-center">
        <button v-if="reddit.subscribed" class="btn btn-secondary me-3" @click="openPostDialog">
          <span class="material-icons add">
            add
          </span>
          Post
        </button>

        <label class="me-2" for="sorting">Sort:</label>
        <select
          id="sorting"
          v-model="sort"
          disabled
          class="form-select"
          aria-label="Default select example">
          <option value="new" selected>
            New
          </option>
          <option value="hot">
            Hot
          </option>
          <option value="best">
            Best
          </option>
        </select>
      </div>

      <form class="d-flex" @submit.prevent="">
        <input
          v-model="search"
          class="form-control me-2"
          type="search"
          placeholder="Post title"
          aria-label="Search">
        <button class="btn" type="submit" :disabled="search == ''">
          <span class="material-icons search">search</span>
        </button>
      </form>
    </div>
  </nav>
</template>

<script>
import { dialogService } from "@/services/dialogService";
import PostDialog from "@/components/dialogs/PostDialog";

export default {
  name: "RedditToolbar",
  props: {
    reddit: { type: Object, required: true }
  },
  data() {
    return {
      sort: "new",
      search: "",
    };
  },
  methods: {
    openPostDialog() {
      dialogService.open(PostDialog, { ...this.reddit });
    }
  }
};
</script>

<style scoped lang="scss">
  button.btn {
    display: inline-flex;
    align-items: center;
  }
</style>