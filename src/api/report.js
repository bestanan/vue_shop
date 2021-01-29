import request from './request'
const reportOptions = {
  title: {
    text: '用户来源'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#E9EEF3'
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      boundaryGap: false
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ]
}

function _getReports() {
  return request({
    method: 'get',
    url: 'reports/type/1'
  })
}

export {
  _getReports,
  reportOptions
}
