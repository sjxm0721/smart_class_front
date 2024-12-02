import request from '@/utils/request'

export const reqGetDevicePageInfo=(schoolId,inUse,input,currentPage,pageSize)=>{
    return request({
        url:'device/page',
        method:'get',
        params:{schoolId,inUse,input,currentPage,pageSize}
    })
}

export const reqAddDevice=(deviceInfo)=>{
    return request({
        url:'device/add',
        method:'post',
        data:deviceInfo,
    })
}

export const reqUpdateDevice=(deviceInfo)=>{
    return request({
        url:'device/update',
        method:'put',
        data:deviceInfo,
    })
}

export const reqClearBindWithClass=(deviceId)=>{
    return request({
        url:'device/clearBind',
        method:'put',
        params:{deviceId}
    })
}

export const reqDeleteDevice=(deviceId)=>{
    return request({
        url:'device/delete',
        method:'delete',
        params:{deviceId}
    })
}

export const reqGetDeviceInfoListByClassId=(classId)=>{
    return request({
        url:'device/listByClassId',
        method:'get',
        params:{classId},
    })
}

export const reqGetDeviceNumber=(schoolId,classId)=>{
    return request({
        url:'device/deviceNumber',
        method:'get',
        params:{schoolId,classId}
    })
}


export const reqDeviceExcelImport=(formData) => {
  return request({
    url:'/device/import',
    method:'post',
    data:formData
  })
}
