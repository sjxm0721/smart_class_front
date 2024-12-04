import request from '@/utils/request'

// 获取可租借设备列表
export const getAvailableDevices = (data) => {
  return request({
    url: '/device-borrow/available',
    method: 'post',
    data
  })
}

// 获取我的租借记录
export const getMyBorrows = (accountId) => {
  return request({
    url: '/device-borrow/my-borrows',
    method: 'get',
    params:{accountId}
  })
}

// 提交租借申请
export const submitBorrow = (data) => {
  return request({
    url: '/device-borrow/borrow',
    method: 'post',
    data
  })
}

// 归还设备
export const returnDevice = (borrowId) => {
  return request({
    url: `/device-borrow/return/${borrowId}`,
    method: 'post'
  })
}

export const deleteBorrow = (borrowId) => {
  return request({
    url: `/device-borrow/delete-borrow/${borrowId}`,
    method: 'delete'
  })
}


// 在 api/device.js 中添加
// 获取待审批列表
export const getPendingApprovals = (params) => {
  return request({
    url: '/device-borrow/approvals',
    method: 'get',
    params
  })
}

// 处理审批
export const handleApproval = (data) => {
  return request({
    url: '/device-borrow/approve',
    method: 'post',
    data
  })
}
