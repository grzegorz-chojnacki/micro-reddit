<template>
  <div>
    <aside></aside>

    <main>
      <Post v-for="post of posts" :post="post" :key="post.id"/>
    </main>

    <footer><LoadingIndicator :done="sourceExhausted"/></footer>
  </div>
</template>

<script>
import Post from '@/components/Post.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

export default {
  name: 'Feed',
  components: { Post, LoadingIndicator },
  props: { fetchingFn: Function },
  data() {
    return {
      page: 0,
      search: 'new',
      posts: [],
      sourceExhausted: false
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
        this.sourceExhausted = posts.length === 0
      })
    }
  }
}
</script>
