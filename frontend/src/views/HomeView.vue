<template>
  <Feed :fetchingFn="fetchHome"/>
</template>

<script>
import Feed from '@/components/Feed.vue'
import { postService } from '@/services/postService.js'

export default {
  name: 'HomeView',
  components: { Feed },
  data() { return { fetchHome: postService.getHome }}
}
</script>