<template>
  <div>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    // 当前页数
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页显示个数选择器的选项设置
    pageSizes: {
      type: Array,
      default() {
        return [1, 2, 5, 10]
      }
    },
    // 每页显示条目个数
    pageSize: {
      type: Number,
      default: 10
    },
    // 布局
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 总条目数
    total: {
      type: Number,
      required: true
    }
  },
  methods: {
    // pageSize 改变时会触发
    handleSizeChange(val) {
      // val 获取改变后的值
      // update:propName 将单向数据流的 prop 改为双向绑定，使子组件可以修改父组件传过来的值并同步到父组件中
      this.$emit('update:pageSize', val)
      this.$emit('pagination-change')
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.$emit('update:currentPage', val)
      this.$emit('pagination-change')
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>