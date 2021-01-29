<template>
  <div>
    <bread-crumb :breadList="breadList"></bread-crumb>

    <el-card>
      <div id="main" style="width: 1000px;height:600px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
import { _getReports, reportOptions } from '../../api/report'

export default {
  data() {
    return {
      breadList: ['数据统计','数据报表']
    }
  },
  created() {

  },
  // dom 渲染完成后才能渲染图表
  mounted() {    
    this.getReports()
  },
  methods: {
    async getReports() {
      const res = await _getReports()
      const options = _.merge(res.data, reportOptions)
      // console.log(options)
      let myChart = echarts.init(document.getElementById('main'));
      myChart.setOption(options)
    }
  }
}
</script>

<style lang="less" scoped>

</style>