<template>
  <section class="card">
    <div class="card-body">
      <h6 class="card-title">
        <strong>{{ comment.user.username }}</strong> wrote:
      </h6>
      <p class="card-text">{{ comment.text }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    comment: Object
  }
}
</script>

<style scoped lang="scss">
</style>