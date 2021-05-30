<template>
  <div>
    <Toolbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";

export default {
  name: "App",
  components: { Toolbar }
};
</script>

<style scoped>
main {
  max-width: 1000px;
  min-height: 100vh;
  padding: 0.5em;
  margin: 0 auto;
}
</style>