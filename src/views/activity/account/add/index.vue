<template>
  <div class="all">
    <div class="form">
      <el-form
        ref="accountInfo"
        :model="accountInfo"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="accountInfo.userId"
            placeholder="请输入用户ID"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号名称" prop="name">
          <el-input
            v-model="accountInfo.name"
            placeholder="请输入账号名称"
            style="width: 150px"
          >
          </el-input>
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
        <el-form-item label="账号权限" prop="auth">
          <el-select
            v-model="accountInfo.auth"
            placeholder="请选择账号权限"
            :disabled="isDisabled"
          >
            <el-option
              v-for="item in auths"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学校" prop="schoolId">
          <el-select
            v-model="accountInfo.schoolId"
            placeholder="请选择所属学校"
            :disabled="isDisabled"
            @change="changeSchool"
          >
            <el-option
              v-for="item in schoolArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级" prop="classId">
          <el-select v-model="accountInfo.classId" placeholder="请选择所属班级" :disabled="accountInfo.schoolId===null||accountInfo.auth!=3">
            <el-option
              v-for="item in classArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="accountInfo.phone"
            placeholder="请输入手机号"
            style="width: 300px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="accountInfo.email"
            placeholder="请输入邮箱"
            style="width: 300px"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <hr style="border-color: gray; width: 80%; opacity: 0.1" />
    <div class="b-button">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitAccount(1)">保存</el-button>
      <el-button type="warning" @click="submitAccount(2)"
        >保存并继续添加</el-button
      >
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
          value: 2,
          label: "校管理员",
        },
        {
          value: 3,
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
.all {
  margin: 20px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
}
.form {
  padding-left: 150px;
}
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
}

.b-button {
  margin-top: 30px;
  margin-left: 300px;
}
</style>
