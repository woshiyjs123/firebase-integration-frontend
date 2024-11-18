import request from '@/utils/request'

// 查询慈善项目列表
export function listBizCharityProject(query) {
  return request({
    url: '/system/bizCharityProject/list',
    method: 'get',
    params: query
  })
}

// 查询慈善项目详细
export function getBizCharityProject(projectId) {
  return request({
    url: '/system/bizCharityProject/' + projectId,
    method: 'get'
  })
}

// 新增慈善项目
export function addBizCharityProject(data) {
  return request({
    url: '/system/bizCharityProject',
    method: 'post',
    data: data
  })
}

// 修改慈善项目
export function updateBizCharityProject(data) {
  return request({
    url: '/system/bizCharityProject',
    method: 'put',
    data: data
  })
}

// 删除慈善项目
export function delBizCharityProject(projectId) {
  return request({
    url: '/system/bizCharityProject/' + projectId,
    method: 'delete'
  })
}
