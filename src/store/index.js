import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import school from './modules/activity/school'
import account from './modules/activity/account'
import myClass from './modules/activity/myClass'
import device from './modules/activity/device'
import student from './modules/activity/student'
import result from './modules/activity/result'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    school,
    account,
    myClass,
    device,
    student,
    result
  },
  getters
})

export default store
