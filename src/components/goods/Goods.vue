<template>
  <div>
    <bread-crumb :breadList="breadText"></bread-crumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-table
      :data="goodsList"
      stripe
      border
      style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格（元）" prop="goods_price" width="120"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="80"></el-table-column>
      <el-table-column label="创建时间" prop="upd_time" width="80"></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="slotProps">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGoods(slotProps.row.goods_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :pageSizes="[5, 10, 15, 20]"
      :total="total"
      :currentPage.sync="queryInfo.pagenum"
      :pageSize.sync="queryInfo.pagesize"
      @pagination-change="getGoodsList"></pagination>
  </div>
</template>

<script>
import Pagination from '../../common/pagination/Pagination'
import { _getGoodsList, _deleteGoodsById } from '../../api/goods'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      breadText: ['商品管理', '商品列表'],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const res = await _getGoodsList(this.queryInfo)
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    async deleteGoods(id) {
      // 重复的代码，待优化
      const confirmRes = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmRes !== 'confirm') {
        return this.$message.info('已取消删除'); 
      }
      const res = await _deleteGoodsById(id)
      if(res.meta.status === 200) {
        this.getGoodsList()
        this.$message.success('删除成功'); 
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>