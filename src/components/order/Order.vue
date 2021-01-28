<template>
  <div>
    <bread-crumb :breadList="breadList"></bread-crumb>

    <el-card>
      <el-row>
        <el-col :span="15">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <!-- 接口问题：搜索功能 -->
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        :data="ordersList"
        stripe
        border
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格（元）" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="slotProps">
            <el-tag type="danger" v-if="slotProps.row.order_pay === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="slotProps">
            {{ slotProps.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="slotProps">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showAddressDialog"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showLogisticsDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination 
        :pageSizes="[5,10,15,20]"
        :total="total"
        :pageSize.sync="queryInfo.pagesize"
        :currentPage.sync="queryInfo.pagenum"
        @pagination-change="getOrderList"></pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%">
      <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="updateForm.address1"
            :props="cascaderProps">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="updateForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流配送 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisible"
      width="50%">
      <span>暂无物流数据</span>
      <!-- <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline> -->
    </el-dialog>
  </div>
</template>

<script>
import { _getOrderList, _getLogisticsInfoById } from '../../api/order'
import cityData from '../../api/citydata'
import Pagination from '../../common/pagination/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      breadList: ['订单管理', '订单列表'],
      cityData,
      ordersList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addressDialogVisible: false,
      updateForm: {
        address1: [],
        address2: ''
      },
      updateFormRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: false,
        value: 'value',
        label: 'label',
        children: 'children'
      },
      // 物流信息
      logisticsInfo: [],
      logisticsDialogVisible: false,
    }
  },
  created() {
    this.getOrderList()
    console.log(this.cityData)
  },
  methods: {
    async getOrderList() {
      const { data: res } = await _getOrderList(this.queryInfo)
      this.total = res.total
      this.ordersList = res.goods
      console.log(res)
    },
    showAddressDialog() {
      this.addressDialogVisible = true
    },
    // 原物流信息接口有问题
    async getLogisticsInfoById() {
      const res = await _getLogisticsInfoById('1106975712662')
      console.log(res)
    },
    showLogisticsDialog() {
      this.logisticsDialogVisible = true
      // this.getLogisticsInfoById()
    }
  }
}
</script>

<style lang="less" scoped>

</style>