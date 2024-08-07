<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Game Blog Management System</div>
    <h1 style="margin-left: 36%; margin-top: 16%">Welcome</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
