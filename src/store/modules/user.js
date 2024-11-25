import { login,tokenLogin,reqEditPassword} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import crypto from '@/utils/crypto'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    accountId:null,
    userId:null,
    name: '',
    avatar: '',
    auth: '',
    schoolId: null,
    classId: null,
    phone: '',
    email: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ACCOUNT_ID:(state,accountId)=>{
    state.accountId=accountId;
  },
  SET_USER_ID:(state,userId)=>{
    state.userId=userId;
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_AUTH:(state,auth)=>{
    state.auth = auth;
  },
  SET_SCHOOL_ID:(state,schoolId)=>{
    state.schoolId = schoolId;
  },
  SET_CLASS_ID:(state,classId)=>{
    state.classId = classId;
  },
  SET_PHONE:(state,phone)=>{
    state.phone=phone;
  },
  SET_EMAIL:(state,email)=>{
    state.email=email;
  }
}

const actions = {
  // user login
  //处理登录业务
  async login({ commit }, userInfo) {
    //结构出用户名与密码
    const { userId, password } = userInfo
    let result=await login({userId:userId.trim(),password:password});
    if(result.code==200){
      commit('SET_TOKEN', result.data['token']);
      commit('SET_ACCOUNT_ID',result.data['accountId']);
      commit('SET_USER_ID',result.data['userId']);
      commit('SET_NAME',result.data['name']);
      commit('SET_AVATAR',result.data['avatar']);
      commit('SET_AUTH',result.data['auth']);
      commit('SET_SCHOOL_ID',result.data['schoolId']);
      commit('SET_CLASS_ID',result.data['classId']);
      commit('SET_PHONE',result.data['phone']);
      commit('SET_EMAIL',result.data['email']);
      setToken(result.data['token']);
      localStorage.setItem('user_auth',crypto.Encrypt(result.data['auth']));
      return 'OK';
    }
    else{
      return Promise.reject(new Error(result.msg));
    }
  },

  async tokenLogin({commit},token){
    let result = await tokenLogin(token);
    if(result.code===200){
      commit('SET_ACCOUNT_ID',result.data['accountId']);
      commit('SET_USER_ID',result.data['userId']);
      commit('SET_NAME',result.data['name']);
      commit('SET_AVATAR',result.data['avatar']);
      commit('SET_AUTH',result.data['auth']);
      commit('SET_SCHOOL_ID',result.data['schoolId']);
      commit('SET_CLASS_ID',result.data['classId']);
      commit('SET_PHONE',result.data['phone']);
      commit('SET_EMAIL',result.data['email']);
      return 'OK';
    }
    else return Promise.reject(new Error(result.msg));
  },

  async editPassword({commit},passwordMsg){
    let result = await reqEditPassword(passwordMsg);
    if(result.code==200){
      return 'OK';
    }
    else return Promise.reject(new Error(result.msg));
  },



  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       removeToken() // must remove  token  first
  //       resetRouter()
  //       commit('RESET_STATE')
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

