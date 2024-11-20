import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

//部分引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

//引入路由 仓库 app组件
import App from './App'
import store from './store'
import router from './router'
import CryptoJS from 'crypto-js'
import crypto from '@/utils/crypto'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
//引入相关api请求接口
import API from '@/api'
//api挂载在vue原型上，任意组件可以使用api相关的接口
Vue.prototype.$API=API;

if(localStorage.getItem('user_auth')!=null){
  const savedAuth = crypto.Decrypt(localStorage.getItem('user_auth'));
  store.commit('user/SET_AUTH',savedAuth);
}
new Vue({
  el: '#app',
  //全局事件总线
  beforeCreate(){
    Vue.prototype.$bus=this;
  },
  router,
  store,
  render: h => h(App)
})
