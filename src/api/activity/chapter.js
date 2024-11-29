import request from '@/utils/request' //引入封装后ajax


export const reqGetChapterList=(subjectId)=>{
  return request({
    url:'/chapter/list',
    method:'get',
    params:{subjectId},
  })
}


export const reqGetChapterInfo=(chapterId)=>{
  return request({
    url:'/chapter/info',
    method:'get',
    params:{chapterId},
  })
}

export const reqAddOrUpdateChapter=(chapterInfo)=>{
  return request({
    url:'/chapter/add-or-update',
    method:'post',
    data:chapterInfo,
  })
}

export const reqUpdateChildrenChapter=(chapterChildInfo)=>{
  return request({
    url:'/chapter/update-child',
    method:'post',
    data:chapterChildInfo,
  })
}

export const reqDeleteChapter=(chapterId)=>{
  return request({
    url:`/chapter/delete/${chapterId}`,
    method:'post'
  })
}


