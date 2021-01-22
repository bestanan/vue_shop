<template>
  <div>
    <!-- 面包屑导航组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    breadList: {
      type: Array,
      required: true,
      default: []
    }
  },
  // created() { 
  //   this.getBreadcrumbList()
  // },
  // methods: {
  //   getBreadcrumbList() {
  //     console.log(this.$route.matched)
  //   }
  // }
}
</script>

<style lang="less" scoped>

</style>