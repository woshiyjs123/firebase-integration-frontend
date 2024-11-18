import request from '@/utils/request'

// 查询邮件管理列表
export function listBizEmailManagement(query) {
  return request({
    url: '/system/bizEmailManagement/list',
    method: 'get',
    params: query
  })
}

// 查询邮件管理详细
export function getBizEmailManagement(emailId) {
  return request({
    url: '/system/bizEmailManagement/' + emailId,
    method: 'get'
  })
}

// 新增邮件管理
export function addBizEmailManagement(data) {
  return request({
    url: '/system/bizEmailManagement',
    method: 'post',
    data: data
  })
}

// 修改邮件管理
export function updateBizEmailManagement(data) {
  return request({
    url: '/system/bizEmailManagement',
    method: 'put',
    data: data
  })
}

// 删除邮件管理
export function delBizEmailManagement(emailId) {
  return request({
    url: '/system/bizEmailManagement/' + emailId,
    method: 'delete'
  })
}
