<template>
  <div class="all">
    <div class="form-container">
      <el-form
        ref="studentInfo"
        :model="studentInfo"
        :rules="formRules"
        label-width="90px"
        class="student-form"
      >
        <el-form-item label="学生姓名" prop="name">
          <el-input
            v-model="studentInfo.name"
            placeholder="请输入学生姓名"
            class="form-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生学号" prop="userId">
          <el-input
            v-model="studentInfo.userId"
            placeholder="请输入学生学号"
            class="form-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input
            v-model="studentInfo.phone"
            placeholder="请输入电话"
            class="form-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input
            v-model="studentInfo.email"
            placeholder="请输入邮件"
            class="form-input"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="divider"></div>
    <div class="button-group">
      <el-button @click="cancel" class="action-button">取消</el-button>
      <el-button type="primary" @click="submitStudent(1)" class="action-button">保存</el-button>
      <el-button type="warning" @click="submitStudent(2)" class="action-button">
        保存并继续添加
      </el-button>
    </div>
  </div>
</template>

<script>
import crypto from "@/utils/crypto";
export default {
  name: "StudentAdd",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value.length != 11) {
        callback(new Error("手机号长度必须为11位"));
      } else {
        callback();
      }
    };
    return {
      studentInfo: {
        accountId: null,
        name: "",
        userId: "",
        schoolId: null,
        classId: null,
        phone: "",
        email: "",
      },
      formRules: {
        name: [
          { required: true, message: "请输入学生姓名", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "请输入学生学号", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入11位手机号", trigger: "blur" ,validator:validatePhone}],
      },
    };
  },
  methods: {
    cancel() {
      this.$router.back();
    },
    submitStudent(type) {
      this.$refs.studentInfo.validate((valid) => {
        if (valid) {
          if (this.studentInfo.accountId == null) {
            //新增
            this.$store
              .dispatch("student/addStudent", this.studentInfo)
              .then(() => {
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
                if (type == 1) {
                  this.$router.push("/student");
                } else {
                  this.studentInfo.accountId = null;
                  this.studentInfo.name = "";
                  this.studentInfo.userId = "";
                  this.studentInfo.phone = "";
                  this.studentInfo.email = "";
                }
              }).catch((err)=>[
                this.$message({
                  type:'error',
                  message:err
                })
              ])
          } else {
            //修改
            this.$store
              .dispatch("student/updateStudent", this.studentInfo)
              .then(() => {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                if (type == 1) {
                  this.$router.push("/student");
                } else {
                  this.studentInfo.accountId = null;
                  this.studentInfo.name = "";
                  this.studentInfo.userId = "";
                  this.studentInfo.phone = "";
                  this.studentInfo.email = "";
                }
              }).catch((err)=>[
                this.$message({
                  type:'error',
                  message:err
                })
              ])
          }
        } else {
          return false;
        }
      });
    },
    async getStudentInfo(accountId) {
      let result = await this.$API.student.reqGetStudentInfoById(accountId);
      if (result.code == 200) {
        this.studentInfo.accountId = result.data["accountId"];
        this.studentInfo.name = result.data["name"];
        this.studentInfo.userId = result.data["userId"];
        this.studentInfo.phone = result.data["phone"];
        this.studentInfo.email = result.data["email"];
        return "ok";
      } else return Promise.reject(new Error(result.msg));
    },
  },
  created() {
    if (this.$route.params.accountId) {
      this.getStudentInfo(this.$route.params.accountId).catch(() => {
        this.$message({
          message: "获取学生信息失败",
          type: "error",
        });
      });
    }
  },
  mounted() {
    this.studentInfo.schoolId = parseInt(
      crypto.Decrypt(localStorage.getItem("schoolId"))
    );
    this.studentInfo.classId = parseInt(
      crypto.Decrypt(localStorage.getItem("classId"))
    );
  },
};
</script>

<style scoped>
.all {
  margin: 10px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
}

.student-form {
  width: 100%;
}

.form-input {
  width: 100%;
}

.divider {
  margin: 20px auto;
  width: 90%;
  height: 1px;
  background-color: rgba(128, 128, 128, 0.1);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 10px;
}

.action-button {
  width: 100%;
}

/* 头像上传相关样式保持不变 */
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

/* 响应式布局 */
@media screen and (min-width: 768px) {
  .all {
    margin: 20px;
    padding: 40px;
  }

  .form-container {
    padding: 0 20px;
  }

  .button-group {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    padding: 0;
  }

  .action-button {
    width: auto;
    min-width: 120px;
  }

  /* 表单项在大屏幕上的样式 */
  .form-input {
    width: 250px;
  }
}

/* Element UI 表单在移动端的优化 */
@media screen and (max-width: 767px) {
  .el-form-item__label {
    float: none;
    text-align: left;
    padding: 0 0 8px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form--label-left .el-form-item__label {
    text-align: left;
  }
}
</style>

