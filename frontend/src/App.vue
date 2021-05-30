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
  <ModeratorDialog id="moderatorDialog" />
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import ModeratorDialog from "./components/dialogs/ModeratorDialog.vue";
import LoginDialog from "@/components/dialogs/LoginDialog.vue";
import RegisterDialog from "@/components/dialogs/RegisterDialog.vue";
import RedditDialog from "@/components/dialogs/RedditDialog.vue";

export default {
  name: "App",
  components: {
    Toolbar,
    ModeratorDialog,
    LoginDialog,
    RegisterDialog,
    RedditDialog,
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