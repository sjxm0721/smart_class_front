<template>
  <div class="all">
    <div class="form">
      <el-form
        ref="studentInfo"
        :model="studentInfo"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="学生姓名" prop="studentName">
          <el-input
            v-model="studentInfo.studentName"
            placeholder="请输入学生姓名"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生学号" prop="studentIdNumber">
          <el-input
            v-model="studentInfo.studentIdNumber"
            placeholder="请输入学生学号"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生性别" prop="studentSex">
          <el-radio-group v-model="studentInfo.studentSex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学生年龄" prop="studentAge">
          <el-input
            type="number"
            v-model.number="studentInfo.studentAge"
            placeholder="请输入学生年龄"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否近视" prop="shortSighted">
          <el-radio-group v-model="studentInfo.shortSighted">
            <el-radio :label="0">不近视</el-radio>
            <el-radio :label="1">近视</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="近视度数" prop="ssValue">
          <el-input
            type="number"
            v-model.number="studentInfo.ssValue"
            placeholder="请输入近视度数"
            :step="0.1"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input
            v-model="studentInfo.phone"
            placeholder="请输入电话"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input
            v-model="studentInfo.email"
            placeholder="请输入邮件"
            style="width: 250px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <hr style="border-color: gray; width: 80%; opacity: 0.1" />
    <div class="b-button">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitStudent(1)">保存</el-button>
      <el-button type="warning" @click="submitStudent(2)"
        >保存并继续添加</el-button
      >
    </div>
  </div>
</template>

<script>
import crypto from "@/utils/crypto";
export default {
  name: "HomeWorkAdd",
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
        studentId: null,
        studentName: "",
        studentIdNumber: "",
        schoolId: null,
        classId: null,
        studentAge: null,
        studentSex: null,
        phone: "",
        email: "",
        shortSighted: null,
        ssValue: null,
      },
      formRules: {
        studentName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" },
        ],
        studentIdNumber: [
          { required: true, message: "请输入学生学号", trigger: "blur" },
        ],
        studentAge: [
          { required: true, message: "请输入学生年龄", trigger: "blur" },
        ],
        studentSex: [
          { required: true, message: "请选择学生性别", trigger: "blur" },
        ],
        shortSighted: [
          { required: true, message: "请选择是否近视", trigger: "blur" },
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
          if (this.studentInfo.studentId == null) {
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
                  this.studentInfo.studentId = null;
                  this.studentInfo.studentName = "";
                  this.studentInfo.studentIdNumber = "";
                  this.studentInfo.studentAge = null;
                  this.studentInfo.studentSex = null;
                  this.studentInfo.phone = "";
                  this.studentInfo.email = "";
                  this.studentInfo.shortSighted = null;
                  this.studentInfo.ssValue = null;
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
                  this.studentInfo.studentId = null;
                  this.studentInfo.studentName = "";
                  this.studentInfo.studentIdNumber = "";
                  this.studentInfo.studentAge = null;
                  this.studentInfo.studentSex = null;
                  this.studentInfo.phone = "";
                  this.studentInfo.email = "";
                  this.studentInfo.shortSighted = null;
                  this.studentInfo.ssValue = null;
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
    async getStudentInfo(studentId) {
      let result = await this.$API.student.reqGetStudentInfoById(studentId);
      if (result.code == 200) {
        this.studentInfo.studentId = result.data["studentId"];
        this.studentInfo.studentName = result.data["studentName"];
        this.studentInfo.studentIdNumber = result.data["studentIdNumber"];
        this.studentInfo.studentSex = result.data["studentSex"];
        this.studentInfo.studentAge = result.data["studentAge"];
        this.studentInfo.phone = result.data["phone"];
        this.studentInfo.email = result.data["email"];
        this.studentInfo.shortSighted = result.data["shortSighted"];
        this.studentInfo.ssValue = result.data["ssValue"];
        return "ok";
      } else return Promise.reject(new Error(result.msg));
    },
  },
  created() {
    if (this.$route.params.studentId) {
      this.getStudentInfo(this.$route.params.studentId).catch(() => {
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
