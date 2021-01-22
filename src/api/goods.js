import request from './request'

// 商品分类数据列表
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

export {
  _getCateList,
  _addCate
}