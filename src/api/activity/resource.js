import request from '@/utils/request'

export const reqGetResourceList=(subjectId,input)=>{
  return request({
    url:'/resource/list',
    method:'get',
    params:{subjectId,input}
  })
}


export const reqDownloadResources=(resourceId)=>{
  return request({
    url:`/resource/download/${resourceId}`,
    method:'get',
    responseType:'blob',
    //不要处理响应数据
    transformResponse:[(data)=>data]
  })
}

// api/activity/resource.js 文件修改
export const reqDownloadResourcesByName = (name, path) => {
  return request({
    url: `/resource/downloadByRscName/${name}`,
    params: { url: path },
    method: 'get',
    responseType: 'blob',
    // 不处理响应数据
    transformResponse: [(data) => data]
  })
}


// 在 api/activity/resource.js 中添加
export const reqAddResource = (data) => {
  return request({
    url: '/resource/add',
    method: 'post',
    data
  })
}
