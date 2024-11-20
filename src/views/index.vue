<template>
  <div class="index">欢迎您使用慈善社区管理后台</div>
</template>

<script>
import { inject } from "vue";
export default {
  setup() {
    const userInfo = inject("userInfo");
    return {
      userInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.index {
  line-height: 50px;
  padding: 0 20px;
  border-radius: 6px;
  background: #c6e2ff;
  color: #666;
}
</style>
