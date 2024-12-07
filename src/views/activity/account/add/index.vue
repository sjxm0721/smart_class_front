<template>
  <div class="page-container">
    <div class="form-wrapper">
      <div class="form-content">
        <el-form
          ref="accountInfo"
          :model="accountInfo"
          :rules="formRules"
          :label-width="isMobile ? '90px' : '80px'"
          class="account-form"
        >
          <!-- 基本信息 -->
          <el-form-item label="用户ID" prop="userId">
            <el-input
              v-model="accountInfo.userId"
              placeholder="请输入用户ID"
              class="form-input"
            ></el-input>
          </el-form-item>

          <el-form-item label="账号名称" prop="name">
            <el-input
              v-model="accountInfo.name"
              placeholder="请输入账号名称"
              class="form-input"
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

          <!-- 权限和归属 -->
          <el-form-item label="账号权限" prop="auth">
            <el-select
              v-model="accountInfo.auth"
              placeholder="请选择账号权限"
              :disabled="isDisabled"
              class="form-select"
            >
              <el-option
                v-for="item in auths"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属学校" prop="schoolId">
            <el-select
              v-model="accountInfo.schoolId"
              placeholder="请选择所属学校"
              :disabled="isDisabled"
              @change="changeSchool"
              class="form-select"
            >
              <el-option
                v-for="item in schoolArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属班级" prop="classId">
            <el-select
              v-model="accountInfo.classId"
              placeholder="请选择所属班级"
              :disabled="accountInfo.schoolId===null||accountInfo.auth==2"
              class="form-select"
            >
              <el-option
                v-for="item in classArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 联系信息 -->
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="accountInfo.phone"
              placeholder="请输入手机号"
              class="form-input"
            ></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="accountInfo.email"
              placeholder="请输入邮箱"
              class="form-input"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="divider"></div>

      <!-- 按钮组 -->
      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitAccount(1)">保存</el-button>
        <el-button type="warning" @click="submitAccount(2)">保存并继续添加</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
export default {
  name: "AccountAdd",
  computed: {
    isDisabled() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1";
    },
    isDisabled2() {
      return this.accountInfo.auth==2;
    },
    ...mapState("school", ["schoolInfoList"]),
    ...mapState("myClass", ["classInfoList"]),
    schoolArray() {
      return this.schoolInfoList.map((school) => ({
        value: school.schoolId,
        label: school.schoolName,
      }));
    },
    classArray() {
      return this.classInfoList.map((myClass) => ({
        value: myClass.classId,
        label: myClass.className,
      }));
    },
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value.length != 11) {
        callback(new Error("手机号长度必须为11位"));
      } else {
        callback();
      }
    };
    return {
      isMobile: false,
      accountInfo: {
        accountId: null,
        userId: "",
        name: "",
        phone: "",
        email: "",
        avatar: "",
        schoolId: null,
        schoolName: "",
        classId: null,
        className: "",
        auth: null,
      },
      auths: [
        {
          value: 0,
          label: "学生",
        },
        {
          value: 2,
          label: "教师",
        },
      ],
      formRules: {
        userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        name: [{ required: true, message: "请添加账号名称", trigger: "blur" }],
        avatar: [{ required: true, message: "请输入账号标识", trigger: "blur" }],
        auth: [{ required: true, message: "请选择账号权限", trigger: "blur" }],
        phone: [
          {
            required: true,
            message: "请输入11位手机号",
            trigger: "blur",
            validator: validatePhone,
          },
        ],
      },
    };
  },
  methods: {
    async getAccountInfo(userId) {
      const result = await this.$API.account.reqGetAccountByUserId(userId);
      if (result.code == 200) {
        this.accountInfo.accountId = result.data["accountId"];
        this.accountInfo.userId = result.data["userId"];
        this.accountInfo.name = result.data["name"];
        this.accountInfo.avatar = result.data["avatar"];
        this.accountInfo.phone = result.data["phone"];
        this.accountInfo.email = result.data["email"];
        this.accountInfo.auth = result.data["auth"];
        this.accountInfo.schoolId = result.data["schoolId"];
        this.accountInfo.schoolName = result.data["schoolName"];
        this.accountInfo.classId = result.data["classId"];
        this.accountInfo.className = result.data["className"];
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
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
    cancel() {
      this.$router.back();
    },
    getClassInfoList(schoolId) {
      this.$store.dispatch("myClass/getClassInfoList", schoolId).catch(() => {
        this.$message({
          type: "error",
          message: "获取班级信息列表失败",
        });
      });
    },
    checkDevice() {
      this.isMobile = window.innerWidth <= 768;
    },
    //添加账号
    submitAccount(type) {
      this.$refs.accountInfo.validate((valid) => {
        if (valid) {
          if (this.accountInfo.accountId == null) {
            //添加
            this.$store
              .dispatch("account/addAccount", this.accountInfo)
              .then(() => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                if (type == 1) {
                  this.$router.push("/account");
                } else {
                  this.accountInfo = {
                    accountId: null,
                    userId: "",
                    name: "",
                    phone: "",
                    email: "",
                    avatar: "",
                    schoolId: this.isDisabled==true?this.$store.getters.schoolId:null,
                    schoolName: "",
                    classId: null,
                    className: "",
                    auth: this.isDisabled==true?3:null,
                  };
                }
              })
              .catch((err) => {
                this.$message({
                  message: err,
                  type: "error",
                });
              });
          } else {
            this.$store
              .dispatch("account/updateAccount", this.accountInfo)
              .then(() => {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                if (type == 1) {
                  this.$router.push("/account");
                } else {
                  this.accountInfo = {
                    accountId: null,
                    userId: "",
                    name: "",
                    phone: "",
                    email: "",
                    avatar: "",
                    schoolId: this.isDisabled==true?this.$store.getters.schoolId:null,
                    schoolName: "",
                    classId: null,
                    className: "",
                    auth: this.isDisabled==true?3:null,
                  };
                }
              })
              .catch((err) => {
                this.$message({
                  message: err,
                  type: "error",
                });
              });
          }
        } else {
          return false;
        }
      });
    },
    changeSchool(){
      this.accountInfo.classId=null;
      this.accountInfo.className="";
    }
  },
  created() {
    if (this.$route.params.userId) {
      this.getAccountInfo(this.$route.params.userId).catch((err) => {
        this.$message({
          type: "error",
          message: err,
        });
      });
    }
    if(this.isDisabled){
      this.accountInfo.auth=3;
      this.accountInfo.schoolId=this.$store.getters.schoolId;
    }
  },
  mounted() {
    this.$store.dispatch("school/getSchoolInfoList");
    this.checkDevice();
    window.addEventListener('resize', this.checkDevice);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDevice);
  },
  watch: {
    'accountInfo.auth':{
      deep:true,
      handler(newValue){
        if(newValue==2){
          this.accountInfo.classId=null;
          this.accountInfo.className="";
        }
      }
    },
    'accountInfo.schoolId':{
      deep:true,
      handler(newValue){
        this.getClassInfoList(this.accountInfo.schoolId);
        if(this.accountInfo.schoolId!=null){
          const selectedSchool=this.schoolArray.find(
            (item) => item.value === this.accountInfo.schoolId
          );
          if (selectedSchool) {
            this.accountInfo.schoolName = selectedSchool.label;
          }
        }
      }
    },
    "accountInfo.classId":{
      deep:true,
      handler(newValue) {
        if (newValue != null) {
          const selectedClass = this.classArray.find(
            (item) => item.value == this.accountInfo.classId
          );
          if (selectedClass) {
            this.accountInfo.className = selectedClass.label;
          }
        }
      },
    }
  },
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.form-wrapper {
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.form-content {
  max-width: 800px;
  margin: 0 auto;
}

.account-form {
  width: 100%;
}

.form-input {
  width: 300px;
  max-width: 100%;
}

.form-select {
  width: 300px;
  max-width: 100%;
}

/* 头像上传样式 */
.avatar-uploader {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: #8c939d 1px dotted;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.divider {
  margin: 30px 0;
  border: none;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .page-container {
    padding: 10px;
  }

  .form-wrapper {
    padding: 20px;
  }

  .form-input,
  .form-select {
    width: 100%;
  }

  .avatar-uploader-icon,
  .avatar {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }

  .button-group {
    flex-direction: column;
    padding: 0 20px;
  }

  .button-group .el-button {
    width: 100%;
    margin-bottom: 10px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  /* 确保标签文字不换行 */
  :deep(.el-form-item__label) {
    white-space: nowrap;
    padding-right: 12px;
  }

  /* 调整表单项在移动端的间距 */
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}

/* 处理超小屏幕 */
@media screen and (max-width: 320px) {
  .form-wrapper {
    padding: 15px;
  }

  .avatar-uploader-icon,
  .avatar {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
}
</style>
