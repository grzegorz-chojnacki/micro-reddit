<template>
  <div>
    <Toolbar/>
    <router-view />
  </div>
</template>

<script>
import Toolbar from './components/Toolbar.vue'

export default {
  name: 'App',
  components: { Toolbar }
}
</script>


<style lang="scss">
.icons {
    @extend .material-icons !optional;
}
</style>
