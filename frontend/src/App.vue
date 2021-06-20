<template>
  <Toolbar />

  <DialogRoot />

  <div id="router">
    <router-view />
  </div>
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

<style lang="scss">
#router {
  max-width: 1000px;
  min-height: 100vh;
  padding: 0.5em;
  margin: 0 auto;
}

main.with-aside {
  display: grid;
  grid-template: "feed";
  gap: 1em;

  @media screen and (min-width: 875px) {
    grid-template: "feed aside";
    grid-template-columns: auto 300px;
    aside {
      grid-area: aside;
    }
  }

  section {
    overflow: hidden;
    grid-area: feed;
  }
}
</style>