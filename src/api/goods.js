import request from './request'

// 获取商品分类数据列表
function _getCateList(queryInfo) {
  return request({
    method: 'get',
    url: 'categories',
    params: queryInfo
  })
  // request.get('categories', {
  //   params: queryInfo
  // })
}

// 添加商品分类
function _addCate(postdata) {
  return request({
    method: 'post',
    url: 'categories',
    data: postdata
  })
}

// 获取参数列表
function _getParamsList(id, queryInfo) {
  return request({
    method: 'get',
    url: `categories/${id}/attributes`,
    params: queryInfo
  })
}

// 获取参数列表
function _addParams(id, data) {
  return request({
    method: 'post',
    url: `categories/${id}/attributes`,
    data: data
  })
}

// 根据 id 查询参数
function _getParamById(cateId, attrId, queryInfo) {
  return request({
    method: 'get',
    url: `categories/${cateId}/attributes/${attrId}`,
    params: queryInfo
  })
}

// 编辑参数
function _updateParamById(cateId, attrId, data) {
  return request({
    method: 'put',
    url: `categories/${cateId}/attributes/${attrId}`,
    data: data
  })
}

// 删除参数
function _deleteParamById(cateId, attrId) {
  return request({
    method: 'delete',
    url: `categories/${cateId}/attributes/${attrId}`
  })
}

// --商品列表--
// 获取商品列表
function _getGoodsList(queryInfo) {
  return request({
    method: 'get',
    url: 'goods',
    params: queryInfo
  })
}

// 删除商品
function _deleteGoodsById(goodsId) {
  return request({
    method: 'delete',
    url: `goods/${goodsId}`
  })
}

// 添加商品
function _addGoods(data) {
  return request({
    method: 'post',
    url: 'goods',
    data: data
  })
}

export {
  _getCateList,
  _addCate,
  _getParamsList,
  _addParams,
  _getParamById,
  _updateParamById,
  _deleteParamById,
  _getGoodsList,
  _deleteGoodsById,
  _addGoods
}