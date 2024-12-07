import request from '@/utils/request'

export const reqGetClassInfoById=(classId)=>{
    return request({
        url:'myclass/info',
        method:'get',
        params:{classId}
    })
}

export const reqGetClassInfoList=(schoolId)=>{
    return request({
        url:'myclass/list',
        method:'get',
        params:{schoolId}
    })
}

// export const reqGetClassPageInfo=(schoolId,input,currentPage,pageSize)=>{
//     return request({
//         url:'myclass/page',
//         method:'get',
//         params:{schoolId,input,currentPage,pageSize}
//     })
// }

export const reqAddClass=(classInfo)=>{
    return request({
        url:'myclass/add',
        method:'post',
        data:classInfo
    })
}

export const reqUpdateClass=(classInfo)=>{
    return request({
        url:'myclass/update',
        method:'put',
        data:classInfo
    })
}

export const reqDeleteClass=(schoolId,classId)=>{
    return request({
        url:'myclass/delete',
        method:'delete',
        params:{schoolId,classId}
    })
}

export const reqClearTeacher=(classId)=>{
    return request({
        url:'myclass/clearTeacher',
        method:'put',
        params:{classId}
    })
}

export const reqGetAllClassList=(accountId)=>{
  return request({
    url:'myclass/all-class',
    method:'get',
    params:{accountId}
  })
}



// 在 api/activity/myClass.js 中
export const reqBindTeachers = (data) => {
  return request({
    url: 'myclass/bind-teachers',
    method: 'post',
    data
  })
}

// api/activity/myClass.js
export const reqGetClassPageInfo = (params) => {
  return request({
    url: 'myclass/page', // 你的实际API地址
    method: 'get',
    params // 使用params而不是data，因为是GET请求
  })
}
