<template>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand">Reddit</a>
      <form class="d-flex">
        <input
          class="form-control me-2 flex-grow"
          type="search"
          placeholder="Reddit name"
          aria-label="Search"
        />
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
      <a class="btn btn-secondary">Login</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Toolbar",
  props: {},
};
</script>

<style scoped>
</style>
