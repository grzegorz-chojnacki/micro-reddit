<template>
  <div>
    <aside></aside>

    <main>
      <Post v-for="post of posts" :post="post" :key="post.id"/>
    </main>

    <footer>
      <div class="d-flex justify-content-center mt-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Post from '@/components/Post.vue'

export default {
  name: 'Feed',
  components: { Post },
  props: { fetchingFn: Function },
  data() {
    return {
      page: 0,
      search: 'new',
      posts: []
    }
  },
  created() {
    this.fetchNext()
    window.onscroll = () => {
      const scrollHeight = window.pageYOffset + window.innerHeight
      const fullHeight = document.documentElement.offsetHeight

      if (scrollHeight >= fullHeight) {
        this.fetchNext()
      }
    }
  },
  methods: {
    fetchNext() {
      this.fetchingFn(this.page, this.search).then(posts => {
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
  min-height: 100vh;
  padding: 0.5em;
  margin: 0 auto;
}
</style>