<template>
  <nav class="card bg-light mt-3">
    <div class="card-body p-2 d-flex justify-content-between">
      <button v-if="reddit.subscribed" class="btn btn-secondary me-3" @click="openPostDialog">
        <span class="material-icons add">
          add
        </span>
        Post
      </button>

      <form class="d-flex" @submit.prevent="">
        <div class="input-group">
          <input
            v-model="search"
            class="form-control"
            type="search"
            placeholder="Search posts"
            aria-label="Search">

          <select v-model="searchType" class="form-select search-type">
            <option value="title">
              By title
            </option>
            <option value="content">
              By content
            </option>
            <option value="both">
              By both
            </option>
          </select>
        </div>

        <button
          class="btn"
          type="submit"
          :disabled="search === ''"
          @click="onSearch">
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
      searchType: "title",
      search: "",
    };
  },
  methods: {
    openPostDialog() {
      dialogService.open(PostDialog, { ...this.reddit });
    },
    onSearch() {
      this.$router.push({
        name: "reddit",
        query: { q: `${this.search};${this.searchType}` }
      });
      this.search = "";
    }
  }
};
</script>

<style scoped lang="scss">
  button.btn {
    display: inline-flex;
    align-items: center;
  }

  form {
    .input-group {
      input  { flex-grow: 2 }
      select { flex-grow: 1 }
    }
  }
</style>