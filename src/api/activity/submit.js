import request from '@/utils/request' //引入封装后ajax


export const reqGetSubmitInfoList=({teacherId,studentId,status,input})=>{
    return request({
        url:'/submit/list',
        method:'get',
      params:{teacherId,studentId,status,input},
    })
}