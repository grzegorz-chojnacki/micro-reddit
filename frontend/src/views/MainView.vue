<template>
  <div>
    <main>
      <Post v-for="post of posts" :post="post" :key="post.id"/>
    </main>
    <aside>
    </aside>
  </div>
</template>

<script>
import Post from '@/components/Post.vue'

import { postService } from '@/services/postService.js'

export default {
  name: 'MainView',
  components: { Post },
  props: { isHome: Boolean },
  data() {
    return {
      postService,
      posts: []
    }
  },
  created() {
    this.postService.getAll().then(posts => {
      this.posts = posts
    })
  }
}
</script>