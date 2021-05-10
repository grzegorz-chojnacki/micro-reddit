<template>
  <section>
    {{post.id}} :: {{post.text}}
  </section>
</template>

<script>
export default {
  name: 'Post',
  props: {
    post: Object
  }
}
</script>

<style>

</style>