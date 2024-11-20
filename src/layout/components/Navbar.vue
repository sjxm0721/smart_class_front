<template>
  <div class="navbar">
    <!-- <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
    /> -->
    <!-- @toggleClick="toggleSideBar" -->
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="personCenter">
            <span style="display: block">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="dialog">
        <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
          <el-carousel height="500px" direction="vertical" :autoplay="false">
            <el-carousel-item>
              <el-form
                :model="accountInfo"
                label-width="100px"
                ref="accountInfo"
                :rules="formRules"
              >
                <el-form-item label="账号名称" prop="name">
                  <el-input
                    v-model="accountInfo.name"
                    style="width: 150px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="账号标识" prop="avatar">
                  <el-upload
                    class="avatar-uploader"
                    action="/admin/common/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="accountInfo.avatar"
                      :src="accountInfo.avatar"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input
                    v-model="accountInfo.phone"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="accountInfo.email"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div style="margin-left: 300px">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBasicInfo"
                  >确 定</el-button
                >
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <span class="item2-head">修改密码</span>
              <el-form
                :model="passwordInfo"
                label-width="100px"
                ref="passwordInfo"
                :rules="formRules2"
                style="margin-top: 40px"
              >
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input
                    v-model="passwordInfo.oldPassword"
                    placeholder="输入旧密码"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword1">
                  <el-input
                    v-model="passwordInfo.newPassword1"
                    placeholder="输入新密码"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="newPassword2">
                  <el-input
                    v-model="passwordInfo.newPassword2"
                    style="width: 300px"
                    placeholder="确认密码"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div style="margin-left: 300px">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEditPassword"
                  >确 定</el-button
                >
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { initVuex } from "@/utils/init";
import { resetRouter } from "@/router";

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value.length != 11) {
        callback(new Error("手机号长度必须为11位"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value != this.passwordInfo.newPassword1) {
        callback(new Error("新密码与确认密码不一致"));
      } else callback();
    };
    return {
      dialogFormVisible: false,
      accountInfo: {
        accountId: null,
        name: "",
        phone: "",
        avatar: "",
        email: "",
      },
      passwordInfo: {
        newPassword1: "",
        newPassword2: "",
        oldPassword: "",
      },
      formRules: {
        name: [{ required: true, message: "请添加账号名称", trigger: "blur" }],
        avatar: [
          { required: true, message: "请输入账号标识", trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: "请输入11位手机号",
            trigger: "blur",
            validator: validatePhone,
          },
        ],
      },
      formRules2: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
        ],
        newPassword1: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
        newPassword2: [
          {
            required: true,
            message: "请确认密码",
            trigger: "blur",
            validator: validatePassword,
          },
        ],
      },
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch("app/toggleSideBar");
    // },
    personCenter() {
      this.accountInfo.accountId = this.$store.getters.accountId;
      this.accountInfo.name = this.$store.getters.name;
      this.accountInfo.avatar = this.$store.getters.avatar;
      this.accountInfo.phone = this.$store.getters.phone;
      this.accountInfo.email = this.$store.getters.email;
      this.dialogFormVisible = true;
    },
    logout() {
      removeToken(); // must remove  token  first
      resetRouter();
      initVuex();
      localStorage.removeItem("user_auth");
      localStorage.removeItem("schoolId");
      localStorage.removeItem("classId");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    handleAvatarSuccess(res, file) {
      this.accountInfo.avatar = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    },
    confirmBasicInfo() {
      this.$refs.accountInfo.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("account/updateAccount", this.accountInfo)
            .then(() => {
              this.$message({
                type: "success",
                message: "修改个人基本信息成功",
              });
              this.$store.dispatch(
                "user/tokenLogin",
                this.$store.getters.token
              );
              this.dialogFormVisible = false;
              this.$router.push('/dashboard');
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: "修改个人基本信息失败",
              });
            });
        } else {
          return false;
        }
      });
    },
    confirmEditPassword() {
      this.$refs.passwordInfo.validate((valid) => {
        if (valid) {
          let passwordMsg = {
            oldPassword: this.passwordInfo.oldPassword,
            newPassword: this.passwordInfo.newPassword1,
            accountId: this.accountInfo.accountId,
          };
          this.$store
            .dispatch("user/editPassword", passwordMsg)
            .then(() => {
              this.$message({
                type: "success",
                message: "修改密码成功",
              });
              this.dialogFormVisible = false;
              this.logout();
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err,
              });
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: #8c939d 1px dotted;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.item2-head {
  margin: 50px;
  font-size: 30px;
}

.navbar {
  padding-left: 10px;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
