import request from '@/utils/request'

// 查询慈善咨询预约管理列表
export function listBizCharityConsultationReservationManagement(query) {
  return request({
    url: '/system/bizCharityConsultationReservationManagement/list',
    method: 'get',
    params: query
  })
}

// 查询慈善咨询预约管理详细
export function getBizCharityConsultationReservationManagement(reservationId) {
  return request({
    url: '/system/bizCharityConsultationReservationManagement/' + reservationId,
    method: 'get'
  })
}

// 新增慈善咨询预约管理
export function addBizCharityConsultationReservationManagement(data) {
  return request({
    url: '/system/bizCharityConsultationReservationManagement',
    method: 'post',
    data: data
  })
}

// 修改慈善咨询预约管理
export function updateBizCharityConsultationReservationManagement(data) {
  return request({
    url: '/system/bizCharityConsultationReservationManagement',
    method: 'put',
    data: data
  })
}

// 删除慈善咨询预约管理
export function delBizCharityConsultationReservationManagement(reservationId) {
  return request({
    url: '/system/bizCharityConsultationReservationManagement/' + reservationId,
    method: 'delete'
  })
}
