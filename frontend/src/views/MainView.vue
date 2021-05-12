<template>
  <div>
    <aside>
      <button @click="fetchNext">Fetch</button>
    </aside>
    <main>
      <Post v-for="post of posts" :post="post" :key="post.id"/>
    </main>
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
      page: 0,
      search: 'new',
      posts: []
    }
  },
  created() { this.fetchNext() },
  methods: {
    fetchNext() {
      this.postService.getAll(this.page, this.search).then(posts => {
        this.posts = this.posts.concat(posts)
        this.page++
      })
    }
  }
}
</script>

<style scoped>
  main {
    max-width: 1000px;
    padding: 0.5em;
    margin: 0 auto;
  }
</style>