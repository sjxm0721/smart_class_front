const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  accountId: state=>state.user.accountId,
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  auth: state=>state.user.auth,
  schoolId: state=>state.user.schoolId,
  classId: state=>state.user.classId,
  phone: state=>state.user.phone,
  email: state=>state.user.email
}
export default getters
