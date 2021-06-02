<template>
  <nav class="card bg-light mt-3">
    <div class="card-body p-2 d-flex justify-content-between">
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
export default {
  name: "RedditToolbar",
  data() {
    return {
      sort: "new",
      search: "",
    };
  }
};
</script>

<style scoped lang="scss">
  button.btn {
    display: inline-flex;
    align-items: center;
  }
</style>