import request from '@/utils/request'

// 查询资讯管理列表
export function listBizNewsManagement(query) {
  return request({
    url: '/system/bizNewsManagement/list',
    method: 'get',
    params: query
  })
}

// 查询资讯管理详细
export function getBizNewsManagement(newsId) {
  return request({
    url: '/system/bizNewsManagement/' + newsId,
    method: 'get'
  })
}

// 新增资讯管理
export function addBizNewsManagement(data) {
  return request({
    url: '/system/bizNewsManagement',
    method: 'post',
    data: data
  })
}

// 修改资讯管理
export function updateBizNewsManagement(data) {
  return request({
    url: '/system/bizNewsManagement',
    method: 'put',
    data: data
  })
}

// 删除资讯管理
export function delBizNewsManagement(newsId) {
  return request({
    url: '/system/bizNewsManagement/' + newsId,
    method: 'delete'
  })
}
