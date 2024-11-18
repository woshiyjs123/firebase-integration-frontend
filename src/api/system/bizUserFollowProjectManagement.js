import request from '@/utils/request'

// 查询用户关注项目管理列表
export function listBizUserFollowProjectManagement(query) {
  return request({
    url: '/system/bizUserFollowProjectManagement/list',
    method: 'get',
    params: query
  })
}

// 查询用户关注项目管理详细
export function getBizUserFollowProjectManagement(id) {
  return request({
    url: '/system/bizUserFollowProjectManagement/' + id,
    method: 'get'
  })
}

// 新增用户关注项目管理
export function addBizUserFollowProjectManagement(data) {
  return request({
    url: '/system/bizUserFollowProjectManagement',
    method: 'post',
    data: data
  })
}

// 修改用户关注项目管理
export function updateBizUserFollowProjectManagement(data) {
  return request({
    url: '/system/bizUserFollowProjectManagement',
    method: 'put',
    data: data
  })
}

// 删除用户关注项目管理
export function delBizUserFollowProjectManagement(id) {
  return request({
    url: '/system/bizUserFollowProjectManagement/' + id,
    method: 'delete'
  })
}
