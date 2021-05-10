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

export default {
  name: 'MainView',
  props: {
    isHome: Boolean
  },
  data() {
    return {
      posts: [{id: 1, text: 'abc'}, {id: 2, text: 'abc'}]
    }
  },
  components: { Post }
}
</script>