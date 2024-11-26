import request from '@/utils/request' //引入封装后ajax


export const reqGetHomeWorkInfoList=(teacherId,input)=>{
    return request({
        url:'/homework/list-ts',
        method:'get',
      params:{teacherId,input},
    })
}

export const reqGetHomeWorkInfo=(homeworkId)=>{
  return request({
    url:'/homework/info',
    method:'get',
    params:{homeworkId},
  })
}

export const reqAddHomework=(homeworkInfo)=>{
  return request({
    url:'/homework/add',
    method:'post',
    data:homeworkInfo
  })
}
