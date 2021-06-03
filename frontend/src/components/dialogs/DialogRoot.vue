<template>
  <span ref="open" data-bs-toggle="modal" data-bs-target="#dialog" />
  <div id="dialog" class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <component :is="component" :data="data" @close="close" />
      </div>
    </div>
  </div>
</template>

<script>
import { dialogService } from "@/services/dialogService.js";

export default {
  name: "DialogRoot",
  data() {
    return { component: null, data: null };
  },
  created() {
    dialogService.component.subscribe(({ component, data }) => {
      if (component) {
        this.component = component;
        setTimeout(() => {
          this.data = data;
          this.$refs.open?.click();
        });
      }
    });
  },
  methods: {
    close(value) {
      dialogService.resolve(value);
    },
  },
};
</script>
