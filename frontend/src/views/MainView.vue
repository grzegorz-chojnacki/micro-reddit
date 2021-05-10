<template>
  <p>Main works! {{ isHome ? 'yay' : 'nay'}}</p>
</template>

<script>

export default {
  name: 'MainView',
  props: {
    isHome: Boolean
  },
  components: {}
}
</script>