<template>
  <section class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <h6 class="card-title">
          <strong>{{ comment.user.username }}</strong> wrote:
        </h6>

        <div>
          <button v-if="modView" class="btn btn-sm" @click="$emit('delete', comment.id)">
            <span class="material-icons">block</span>
          </button>

          <button v-if="adminView && notMyself" class="btn btn-sm" @click="$emit('ban', comment.user)">
            <span class="material-icons">person_off</span>
          </button>
        </div>
      </div>

      <p class="card-text">
        {{ comment.content }}
      </p>
    </div>
  </section>
</template>

<script>
import { userService } from "@/services/userService";

export default {
  name: "Comment",
  props: {
    comment: { type: Object, required: true },
    modView: { type: Boolean, default: false },
    adminView: { type: Boolean, default: false }
  },
  emits: ["delete", "ban"],
  computed: {
    notMyself() {
      return userService.user.value.username !== this.comment.user.username;
    }
  }
};
</script>
