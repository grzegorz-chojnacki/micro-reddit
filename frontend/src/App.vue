<template>
  <Toolbar />

  <DialogRoot />

  <main>
    <router-view />
  </main>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import DialogRoot from "./components/dialogs/DialogRoot.vue";

export default {
  name: "App",
  components: {
    Toolbar, DialogRoot
  },
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