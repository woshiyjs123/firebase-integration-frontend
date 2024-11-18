import request from '@/utils/request'

// 查询用户管理列表
export function listBizUserManagement(query) {
  return request({
    url: '/system/bizUserManagement/list',
    method: 'get',
    params: query
  })
}

// 查询用户管理详细
export function getBizUserManagement(userId) {
  return request({
    url: '/system/bizUserManagement/' + userId,
    method: 'get'
  })
}

// 新增用户管理
export function addBizUserManagement(data) {
  return request({
    url: '/system/bizUserManagement',
    method: 'post',
    data: data
  })
}

// 修改用户管理
export function updateBizUserManagement(data) {
  return request({
    url: '/system/bizUserManagement',
    method: 'put',
    data: data
  })
}

// 删除用户管理
export function delBizUserManagement(userId) {
  return request({
    url: '/system/bizUserManagement/' + userId,
    method: 'delete'
  })
}
