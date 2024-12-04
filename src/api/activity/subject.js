import request from '@/utils/request'

export const reqGetSubjectInfoList=({teacherId,studentId,input})=>{
  return request({
    url:'/subject/list',
    method:'get',
    params:{teacherId,studentId,input},
  })
}

export const reqGetSubjectInfo=(subjectId)=>{
  return request({
    url:'/subject/info',
    method:'get',
    params:{subjectId}
  })
}

export const reqAddOrUpdateSubject=(subjectInfo) => {
  return request({
    url:'/subject/add-or-update',
    method:'post',
    data:subjectInfo
  })
}


export const reqExportGrades = (subjectId) => {
  return request({
    url: '/subject/export',
    method: 'get',
    params: { subjectId },
    responseType: 'blob' // 用于文件下载
  })
}
