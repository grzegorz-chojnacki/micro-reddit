<template>
  <div v-if="!done" class="d-flex justify-content-center mt-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingIndicator',
  props: { done: Boolean }
}
</script>
