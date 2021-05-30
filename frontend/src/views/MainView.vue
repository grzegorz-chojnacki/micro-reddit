<template>
  <Feed :fetching-fn="fetchMain" />
</template>

<script>
import Feed from "@/components/Feed.vue";
import { postService } from "@/services/postService.js";

export default {
  name: "MainView",
  components: { Feed },
  data() {
 return { fetchMain: postService.getAll };
}
};
</script>
