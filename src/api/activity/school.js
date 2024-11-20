import request from '@/utils/request' //引入封装后ajax

export const reqGetSchoolInfo=(currentPage,pageSize,input)=>{
    return request({
        url:'/school/info',
        method:'get',
        params:{currentPage,pageSize,input},
    })
}

export const reqAddSchool=(schoolDTO)=>{
    return request({
        url:'/school/add',
        method:'post',
        data:schoolDTO,
    })
}

export const reqUpdateSchool=(schoolDTO)=>{
    return request({
        url:'/school/update',
        method:'put',
        data:schoolDTO,
    })
}

export const reqDeleteSchool=(schoolId)=>{
    return request({
        url:'/school/delete',
        method:'delete',
        params:{schoolId}
    })
}

export const reqGetSchoolInfoBySchoolId=(schoolId)=>{
    return request({
        url:`/school/search/${schoolId}`,
        method:'get'
    })
}

export const reqGetSchoolInfoList=()=>{
    return request({
        url:'/school/list',
        method:'get'
    })
}