import request from '@/utils/request' //引入封装后ajax


export const reqGetSubmitInfoList=({teacherId,studentId,status,input})=>{
    return request({
        url:'/submit/list',
        method:'get',
      params:{teacherId,studentId,status,input},
    })
}

export const reqGetSubmitInfo=(submitId)=>{
  return request({
    url:'/submit/info',
    method:'get',
    params:{submitId},
  })
}


export const reqAddSubmit=(submitInfo) => {
  return request({
    url:'/submit/add',
    method:'post',
    data:submitInfo
  })
}

export const reqGiveComment=(data) => {
  return request({
    url:'/submit/give-comment',
    method:'post',
    data:data
  })
}
