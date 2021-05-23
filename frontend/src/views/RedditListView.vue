<template>
  <main>
    <Reddit class="my-2"
      v-for="reddit of reddits" :reddit="reddit" :key="reddit.id"/>
  </main>

  <footer><LoadingIndicator/></footer>
</template>

<script>
import Reddit from '@/components/Reddit.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import { redditService } from '@/services/redditService'

export default {
  name: 'RedditListView',
  components: { Reddit, LoadingIndicator },
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
