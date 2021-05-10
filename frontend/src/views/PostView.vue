<template>
  <p>Post works! {{ postId }}</p>
</template>

<script>

export default {
  name: 'PostView',
  props: { redditId: String, postId: String },
  components: {}
}
</script>