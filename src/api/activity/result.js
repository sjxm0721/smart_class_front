import request from '@/utils/request'

export const reqGetResultInfo=(selectClass,selectSchool,select,input)=>{
    return request({
        url:'/sightResult/info',
        method:'get',
        params:{classId:selectClass,schoolId:selectSchool,select,input}
    })
}

export const reqUpdateResultInfo=(changedResult)=>{
    return request({
        url:'/sightResult/update',
        method:'put',
        data:changedResult,
    })
}

export const reqGetYesResultTime=(schoolId,classId,timeStart,timeEnd)=>{
    return request({
        url:'/sightResult/yesResultTime',
        method:'get',
        params:{schoolId,classId,timeStart,timeEnd}
    })
}

export const reqGetResultStatus=(schoolId,classId,timeStart,timeEnd)=>{
    return request({
        url:'/sightResult/resultStatus',
        method:'get',
        params:{schoolId,classId,timeStart,timeEnd}
    })
}