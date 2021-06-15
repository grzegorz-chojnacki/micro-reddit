<template>
  <section class="card">
    <div class="card-body">
      <h6 class="card-title">
        <strong>{{ comment.user.username }}</strong> wrote:
      </h6>
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
  },
};
</script>

<style scoped lang="scss">
</style>