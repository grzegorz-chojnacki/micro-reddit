<template>
  <div>
    <Toolbar />
    <main>
      <router-view />
    </main>
  </div>
  <LoginDialog id="loginDialog" />
  <RegisterDialog id="registerDialog" />
  <RedditDialog id="redditDialog" />
  <MetadataDialog id="metadataDialog" />
  <ModeratorDialog id="moderatorDialog" />
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import LoginDialog from "@/components/dialogs/LoginDialog.vue";
import RegisterDialog from "@/components/dialogs/RegisterDialog.vue";
import RedditDialog from "@/components/dialogs/RedditDialog.vue";
import MetadataDialog from "@/components/dialogs/MetadataDialog.vue";
import ModeratorDialog from "./components/dialogs/ModeratorDialog.vue";

export default {
  name: "App",
  components: {
    Toolbar,
    LoginDialog,
    RegisterDialog,
    RedditDialog,
    MetadataDialog,
    ModeratorDialog,
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