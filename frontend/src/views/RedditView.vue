<template>
  <main>
    <aside v-if="reddit">
      <RedditMeta :reddit="reddit" />
    </aside>

    <section>
      <nav class="card bg-light mt-3">
        <div class="card-body d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <button class="btn btn-secondary me-3">
              <span
                class="material-icons add"
                data-bs-toggle="modal"
                data-bs-target="#">
                add
              </span>
              Post
            </button>

            <label class="me-2" for="sorting">Sort:</label>
            <select id="sorting" v-model="sort" class="form-select" aria-label="Default select example">
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
            <button class="btn" type="submit">
              <span class="material-icons search">search</span>
            </button>
          </form>
        </div>
      </nav>

      <Feed :fetching-fn="fetchReddit" />
    </section>
  </main>
</template>

<script>
import RedditMeta from "@/components/RedditMeta.vue";
import Feed from "@/components/Feed.vue";
import { postService } from "@/services/postService.js";
import { redditService } from "@/services/redditService.js";

export default {
  name: "RedditView",
  components: { RedditMeta, Feed },
  props: { redditId: { type: String, required: true } },
  data() {
    return {
      sort: "new",
      search: "",
      fetchReddit: postService.getAllReddit(this.redditId),
      reddit: null,
    };
  },
  created() {
    redditService.reddit.subscribe((reddit) => (this.reddit = reddit));
  },
  async mounted() {
    await redditService.get(this.redditId);
  },
};
</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template: "feed";
  gap: 1em;

  @media screen and (min-width: 800px) {
    grid-template-columns: auto 250px;
    grid-template: "feed aside";
    aside {
      grid-area: aside;
    }
  }

  section {
    grid-area: feed;
  }

  button.btn {
    display: inline-flex;
    align-items: center;
  }
}
</style>
