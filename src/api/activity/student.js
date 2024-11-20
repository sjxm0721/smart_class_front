import request from '@/utils/request'

export const reqGetStudentInfoList=(classId,studentName,studentIdNumber)=>{
    return request({
        url:'/student/list',
        method:'get',
        params:{classId,studentName,studentIdNumber}
    })
}

export const reqGetStudentInfoById=(studentId)=>{
    return request({
        url:'/student/info',
        method:'get',
        params:{studentId}
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