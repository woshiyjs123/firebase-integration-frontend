import request from '@/utils/request'

// 查询捐赠记录列表
export function listBizDonationRecord(query) {
  return request({
    url: '/system/bizDonationRecord/list',
    method: 'get',
    params: query
  })
}

// 查询捐赠记录详细
export function getBizDonationRecord(donationId) {
  return request({
    url: '/system/bizDonationRecord/' + donationId,
    method: 'get'
  })
}

// 新增捐赠记录
export function addBizDonationRecord(data) {
  return request({
    url: '/system/bizDonationRecord',
    method: 'post',
    data: data
  })
}

// 修改捐赠记录
export function updateBizDonationRecord(data) {
  return request({
    url: '/system/bizDonationRecord',
    method: 'put',
    data: data
  })
}

// 删除捐赠记录
export function delBizDonationRecord(donationId) {
  return request({
    url: '/system/bizDonationRecord/' + donationId,
    method: 'delete'
  })
}
