<template>
  <div class="btn-group" role="group" aria-label="Post voting">
    <button :class="isSelected(+1)" @click="vote(+1)">
      <span class="material-icons add">add</span>
    </button>

    <button class="btn btn-outline-dark score" disabled>
      <span class="vote">{{ score }}</span>
    </button>

    <button :class="isSelected(-1)" @click="vote(-1)">
      <span class="material-icons remove">remove</span>
    </button>
  </div>
</template>

<script>
import LoginDialog from "@/components/dialogs/LoginDialog.vue";
import { userService } from "@/services/userService.js";
import { dialogService } from "@/services/dialogService.js";

const buttonClasses = "btn btn-outline-dark ";

export default {
  name: "VoteGroup",
  props: {
    score: { type: Number, default: 0 },
    voted: { type: Number, default: 0 }
  },
  emits: ["vote"],
  methods: {
    vote(state) {
      if (!userService.isAuthenticated.value) {
        return dialogService.open(LoginDialog);
      }

      if (state === this.voted) {
        this.$emit("vote", 0);
      } else {
        this.$emit("vote", state);
      }
    },
    isSelected(buttonMark) {
      return this.voted === buttonMark ? buttonClasses + "selected" : buttonClasses;
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/variables";

button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5em;

  &[disabled] {
    opacity: 1;
  }

  &.score {
    box-sizing: content-box;
    min-width: 3ch;
  }

  &.selected {
    color: $light;
    background-color: $dark;
  }
}

</style>