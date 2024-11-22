import request from '@/utils/request' //引入封装后ajax


export const reqGetHomeWorkInfoList=(teacherId,input)=>{
    return request({
        url:'/homework/list',
        method:'get',
      params:{teacherId,input},
    })
}
