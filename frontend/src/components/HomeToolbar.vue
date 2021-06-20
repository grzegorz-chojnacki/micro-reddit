<template>
  <div class="mt-3 input-group">
    <label class="input-group-text" for="sortType">Sort by </label>
    <select id="sortType" v-model="sort" class="form-select" @change="changeSort">
      <option value="new">
        New
      </option>
      <option value="best">
        Best
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "HomeToolbar",
  emits: [ "sort" ],
  data() {
    return { sort: "new" };
  },
  methods: {
    changeSort() {
      this.$emit("sort", this.sort);
    }
  }
};
</script>
