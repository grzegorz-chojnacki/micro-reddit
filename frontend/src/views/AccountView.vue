<template>
  <section class="card">
    <header class="card-header">
      <h5 class="mb-0">
        Account settings
      </h5>
    </header>

    <div class="card-body">
      <ul class="list-group list-group-flush">
        <button class="list-group-item list-group-item-action" @click="open(UsernameDialog)">
          <span>Username</span>
          <span class="spacer" />
          <span class="text-secondary">flutherhole</span>
          <span class="material-icons">chevron_right</span>
        </button>

        <button class="list-group-item list-group-item-action" @click="open(EmailDialog)">
          <span>Email</span>
          <span class="spacer" />
          <span class="text-secondary">flutherhole@gmail.com</span>
          <span class="material-icons">chevron_right</span>
        </button>

        <button class="list-group-item list-group-item-action" @click="open(PasswordDialog)">
          <span>Password</span>
          <span class="spacer" />
          <span class="text-secondary">********</span>
          <span class="material-icons">chevron_right</span>
        </button>
      </ul>
    </div>
  </section>
</template>

<script>
import UsernameDialog from "@/components/dialogs/UsernameDialog.vue";
import PasswordDialog from "@/components/dialogs/PasswordDialog.vue";
import EmailDialog from "@/components/dialogs/EmailDialog.vue";
import { dialogService } from "@/services/dialogService.js";

export default {
  name: "AccountView",
  data() {
    return { UsernameDialog, PasswordDialog, EmailDialog };
  },
  methods: {
    open(dialog) {
      dialogService.open(dialog).then();
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  margin: 1em 0;
}

.list-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.spacer {
  flex-grow: 1;
}

span.text-secondary {
  margin-right: 2em;
}
</style>
