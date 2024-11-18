import request from '@/utils/request'

// 查询慈善项目公示列表
export function listBizCharityProjectPublicity(query) {
  return request({
    url: '/system/bizCharityProjectPublicity/list',
    method: 'get',
    params: query
  })
}

// 查询慈善项目公示详细
export function getBizCharityProjectPublicity(publicityId) {
  return request({
    url: '/system/bizCharityProjectPublicity/' + publicityId,
    method: 'get'
  })
}

// 新增慈善项目公示
export function addBizCharityProjectPublicity(data) {
  return request({
    url: '/system/bizCharityProjectPublicity',
    method: 'post',
    data: data
  })
}

// 修改慈善项目公示
export function updateBizCharityProjectPublicity(data) {
  return request({
    url: '/system/bizCharityProjectPublicity',
    method: 'put',
    data: data
  })
}

// 删除慈善项目公示
export function delBizCharityProjectPublicity(publicityId) {
  return request({
    url: '/system/bizCharityProjectPublicity/' + publicityId,
    method: 'delete'
  })
}
