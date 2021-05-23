<template>
  <main>
    <Reddit class="my-2"
      v-for="reddit of reddits" :reddit="reddit" :key="reddit.id"/>
  </main>

  <footer>
    <div class="d-flex justify-content-center mt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </footer>
</template>

<script>
import Reddit from '@/components/Reddit.vue'
import { redditService } from '@/services/redditService'

export default {
  name: 'RedditListView',
  components: { Reddit },
  data() {
    return {
      page: 0,
      search: '',
      reddits: []
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
      redditService.getAll(this.page, this.search).then(reddits => {
        console.log(reddits)
        this.reddits = this.reddits.concat(reddits)
        this.page++
      })
    }
  }
}
</script>
