import request from './request'

// 获取商品分类数据列表
function _getCateList(query) {
  return request({
    method: 'get',
    url: 'categories',
    params: query
  })
  // request.get('categories', {
  //   params: query
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
function _getParamsList(id, query) {
  return request({
    method: 'get',
    url: `categories/${id}/attributes`,
    params: query
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
function _getParamById(cateId, attrId, query) {
  return request({
    method: 'get',
    url: `categories/${cateId}/attributes/${attrId}`,
    params: query
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

export {
  _getCateList,
  _addCate,
  _getParamsList,
  _addParams,
  _getParamById,
  _updateParamById,
  _deleteParamById
}