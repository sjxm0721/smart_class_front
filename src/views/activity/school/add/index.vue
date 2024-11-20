<template>
  <div class="all">
    <div class="form">
      <el-form
        ref="schoolInfo"
        :model="schoolInfo"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="学校名称" prop="schoolName">
          <el-input
            v-model="schoolInfo.schoolName"
            placeholder="请输入学校名称"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="学校标识" prop="pic">
          <el-upload
            class="avatar-uploader"
            action="/admin/common/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="schoolInfo.pic" :src="schoolInfo.pic" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="学校地址" prop="address">
          <el-input
            type="textarea"
            placeholder="请输入学校地址"
            v-model="schoolInfo.address"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <hr style="border-color: gray; width: 80%; opacity: 0.1" />
    <div class="b-button">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitSchool(1)">保存</el-button>
      <el-button type="warning" @click="submitSchool(2)"
        >保存并继续添加</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SchoolAdd",
  data() {
    return {
      schoolInfo: {
        schoolId: null,
        schoolName: "",
        address: "",
        pic: "",
      },
      formRules: {
        schoolName: [
          { required: true, message: "请输入学校名称", trigger: "blur" },
        ],
        pic: [{ required: true, message: "请添加学校标识", trigger: "blur" }],
        address: [
          { required: true, message: "请输入学校地址", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.$route.params.schoolId) {
      this.getSchoolInfo(this.$route.params.schoolId).catch(() => {
        this.$message({
          message: "获取学校信息失败",
          type: "error",
        });
      });
    }
  },
  methods: {
    async getSchoolInfo(schoolId) {
      const result = await this.$API.school.reqGetSchoolInfoBySchoolId(
        schoolId
      );
      if (result.code == 200) {
        this.schoolInfo.schoolId = result.data["schoolId"];
        this.schoolInfo.schoolName = result.data["schoolName"];
        this.schoolInfo.address = result.data["address"];
        this.schoolInfo.pic = result.data["pic"];
        return "ok";
      } else return Promise.reject(new Error(result.msg));
    },
    handleAvatarSuccess(res, file) {
      this.schoolInfo.pic = res.data;
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
    submitSchool(type) {
      this.$refs.schoolInfo.validate((valid) => {
        if (valid) {
          if (this.schoolInfo.schoolId == null) {
            this.$store
              .dispatch("school/addSchool", this.schoolInfo)
              .then(() => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                if (type == 1) {
                  this.$router.push("/school");
                } else {
                  this.schoolInfo = {
                    schoolId: null,
                    schoolName: "",
                    address: "",
                    pic: "",
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
              .dispatch("school/updateSchool", this.schoolInfo)
              .then(() => {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                if(type==1)
                {
                  this.$router.push("/school");
                }
                else{
                  this.schoolInfo = {
                    schoolId: null,
                    schoolName: "",
                    address: "",
                    pic: "",
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
