//将四个模块请求的接口函数统一暴露
import * as school from './activity/school'
import * as account from './activity/account'
import * as myClass from './activity/myClass'
import * as device from './activity/device'
import * as student from './activity/student'
import * as submit from './activity/submit'
import * as subject from './activity/subject'
import * as resource from './activity/resource'

export default{
  school,
  account,
  myClass,
  device,
  student,
  submit,
  subject,
  resource
}
