import request from '@/utils/request'

export const reqGetStudentInfoList=(classId,name,userId)=>{
    return request({
        url:'/student/list',
        method:'get',
        params:{classId,name,userId}
    })
}

export const reqGetStudentInfoById=(accountId)=>{
    return request({
        url:'/student/info',
        method:'get',
        params:{accountId}
    })
}

export const reqAddStudent=(studentInfo) => {
    return request({
        url:'/student/add',
        method:'post',
        data:studentInfo
    })
}

export const reqUpdateStudent=(studentInfo)=>{
    return request({
        url:'/student/update',
        method:'put',
        data:studentInfo
    })
}

export const reqDeleteStudent=(ids)=>{
    return request({
        url:'/student/delete',
        method:'delete',
        params:{ids}
    })
}

export const reqGetStudentNumberAndStatus=(schoolId,classId)=>{
    return request({
        url:'/student/studentNumberAndSight',
        method:'get',
        params:{schoolId,classId},
    })
}

export const reqGetAllStudentList=(accountId)=>{
  return request({
    url:'/student/all-stu',
    method:'get',
    params:{accountId},
  })
}


export const reqStudentExcelImport=(formData) => {
  return request({
    url:'/student/import',
    method:'post',
    data:formData
  })
}
