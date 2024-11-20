import request from '@/utils/request' //引入封装后ajax

export const reqGetAccountPageInfo=(auth,input,currentPage,pageSize,schoolId)=>{
    return request({
        url:'/user/page',
        method:'get',
        params:{auth,input,currentPage,pageSize,schoolId}
    })
}

export const reqUpdateAccountStatus=(userId)=>{
    return request({
        url:'/user/status',
        method:'put',
        params:{userId}
    })
}

export const reqGetAccountByUserId=(userId)=>{
    return request({
        url:'/user/info',
        method:'get',
        params:{userId}
    })
}

export const reqAddAccount=(accountInfo)=>{
    return request({
        url:'/user/add',
        method:'post',
        data:accountInfo
    })
}

export const reqUpdateAccount=(accountInfo)=>{
    return request({
        url:'/user/update',
        method:'put',
        data:accountInfo
    })
}

export const reqDeleteAccount=(accountId)=>{
    return request({
        url:'/user/delete',
        method:'delete',
        params:{accountId}
    })
}

export const reqGetTeacherNumber=(schoolId,classId)=>{
    return request({
        url:'/user/teacherNumber',
        method:'get',
        params:{schoolId,classId},
    })
}