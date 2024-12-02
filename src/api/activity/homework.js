import request from '@/utils/request' //引入封装后ajax


export const reqGetHomeWorkInfoList=(teacherId,studentId,input)=>{
    return request({
        url:'/homework/list-ts',
        method:'get',
      params:{teacherId,studentId,input},
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


export const reqGetHomeWorkList=(subjectId,studentId)=>{
  return request({
    url:'/homework/list',
    method:'get',
    params:{subjectId,studentId},
  })
}

export const reqDelHomework=(homeworkId)=>{
  return request({
    url:'/homework/delete',
    method:'delete',
    params:{homeworkId}
  })
}
