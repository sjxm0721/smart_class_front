//引入axios axios进行了二次封装

//用户登录使用的api仓库  后续根据后端用户登录接口修改
import request from '@/utils/request'

//对外暴露登录接口函数
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function tokenLogin(token){
  return request({
    url:'/user/tokenLogin',
    method:'get',
    params:{token:token}
  })
}

export function reqEditPassword(passwordMsg){
  return request({
    url:'/user/editPassword',
    method:'put',
    data:passwordMsg
  })
}


//对外暴露退出登录的函数
// export function logout() {
//   return request({
//     url: '/admin/acl/index/logout',
//     method: 'post'
//   })
// }
