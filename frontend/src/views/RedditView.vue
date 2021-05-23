<template>
  <Feed :fetchingFn="fetchReddit"/>
</template>

<script>
import Feed from '@/components/Feed.vue'
import { postService } from '@/services/postService.js'

export default {
  name: 'RedditView',
  props: { redditId: String },
  components: { Feed },
  data() { return { fetchReddit: postService.getAllReddit(this.redditId) }}
}
</script>