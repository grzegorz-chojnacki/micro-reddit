<template>
  <label class="me-2" for="sortType">Sort by </label>
  <select id="sortType" v-model="sort" class="form-select" @change="changeSort">
    <option value="new">
      New
    </option>
    <option value="best">
      Best
    </option>
  </select>
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

<style scoped lang="scss">
</style>