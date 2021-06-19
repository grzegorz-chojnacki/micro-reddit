<template>
  <section class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <h6 class="card-title">
          <strong>{{ comment.user.username }}</strong> wrote:
        </h6>

        <button v-if="modView" class="btn btn-sm" @click="$emit('delete', comment.id)">
          <span class="material-icons">block</span>
        </button>
      </div>

      <p class="card-text">
        {{ comment.content }}
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "Comment",
  props: {
    comment: { type: Object, required: true },
    modView: { type: Boolean, required: true }
  },
  emits: ["delete"],
};
</script>

<style scoped lang="scss">
</style>