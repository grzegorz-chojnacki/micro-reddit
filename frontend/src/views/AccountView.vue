<template>
  <section class="card">
    <header class="card-header">
      <h5 class="mb-0">
        Account settings
      </h5>
    </header>

    <div class="card-body">
      <ul class="list-group list-group-flush">
        <button class="list-group-item list-group-item-action" @click="openUsernameDialog">
          <span>Username</span>
          <span class="spacer" />
          <span class="text-secondary">{{ user.username }}</span>
          <span class="material-icons">chevron_right</span>
        </button>

        <button class="list-group-item list-group-item-action" @click="openEmailDialog">
          <span>Email</span>
          <span class="spacer" />
          <span class="text-secondary">{{ user.email }}</span>
          <span class="material-icons">chevron_right</span>
        </button>

        <button class="list-group-item list-group-item-action" @click="openPasswordDialog">
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
import { userService } from "@/services/userService.js";

export default {
  name: "AccountView",
  data() {
    return {
      subscription: null,
      user: null,
    };
  },
  created() {
    this.subscription = userService.user.subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.$router.push({ name: "main" });
      }
    });
  },
  unmounted() {
    this.subscription.unsubscribe();
  },
  methods: {
    openUsernameDialog() {
      dialogService.open(UsernameDialog, this.user).then();
    },
    openPasswordDialog() {
      dialogService.open(PasswordDialog, this.user).then();
    },
    openEmailDialog() {
      dialogService.open(EmailDialog, this.user).then();
    },
  },
};
</script>

<style lang="scss" scoped>
section {
  margin: 1em 0;
}

button.list-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    &.spacer { flex-grow: 1; }
    &.text-secondary { margin-right: 2em; }
  }
}
</style>
