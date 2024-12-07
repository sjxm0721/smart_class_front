<template>
  <div class="page-container">
    <div class="form-wrapper">
      <div class="form-content">
        <el-form
          ref="schoolInfo"
          :model="schoolInfo"
          :rules="formRules"
          :label-width="isMobile ? '90px' : '80px'"
        >
          <el-form-item label="学校名称" prop="schoolName">
            <el-input
              v-model="schoolInfo.schoolName"
              placeholder="请输入学校名称"
              class="custom-input"
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
              class="custom-input"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="divider"></div>

      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitSchool(1)">保存</el-button>
        <el-button type="warning" @click="submitSchool(2)">保存并继续添加</el-button>
      </div>
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
      isMobile: false,
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
    this.checkDevice();
    window.addEventListener('resize', this.checkDevice);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDevice);
  },
  methods: {
    checkDevice() {
      this.isMobile = window.innerWidth <= 768;
    },
    async getSchoolInfo(schoolId) {
      const result = await this.$API.school.reqGetSchoolInfoBySchoolId(schoolId);
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
      // 保持原有的提交逻辑不变
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
                if(type==1) {
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
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
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

.custom-input {
  max-width: 400px;
  width: 100%;
}

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
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border: #8c939d 1px dotted;
}

.avatar {
  width: 150px;
  height: 150px;
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
  margin-top: 20px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .page-container {
    padding: 10px;
  }

  .form-wrapper {
    padding: 20px;
  }

  .custom-input {
    max-width: 100%;
  }

  .avatar-uploader-icon {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .button-group {
    flex-direction: column;
    padding: 0 20px;
  }

  .button-group .el-button {
    width: 100%;
    margin-bottom: 10px;
  }

  /* 调整表单项在移动端的间距 */
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    padding-right: 12px;
    font-size: 14px;
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
