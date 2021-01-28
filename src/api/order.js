import request from './request'

function _getOrderList(queryInfo) {
  return request({
    method: 'get',
    url: 'orders',
    params: queryInfo
  })
}

function _getLogisticsInfoById(id) {
  return request({
    method: 'get',
    url: `/kuaidi/${id}`
  })
}

export {
  _getOrderList,
  _getLogisticsInfoById
}