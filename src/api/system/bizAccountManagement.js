import request from '@/utils/request'

// 查询账目管理列表
export function listBizAccountManagement(query) {
  return request({
    url: '/system/bizAccountManagement/list',
    method: 'get',
    params: query
  })
}

// 查询账目管理详细
export function getBizAccountManagement(recordId) {
  return request({
    url: '/system/bizAccountManagement/' + recordId,
    method: 'get'
  })
}

// 新增账目管理
export function addBizAccountManagement(data) {
  return request({
    url: '/system/bizAccountManagement',
    method: 'post',
    data: data
  })
}

// 修改账目管理
export function updateBizAccountManagement(data) {
  return request({
    url: '/system/bizAccountManagement',
    method: 'put',
    data: data
  })
}

// 删除账目管理
export function delBizAccountManagement(recordId) {
  return request({
    url: '/system/bizAccountManagement/' + recordId,
    method: 'delete'
  })
}
