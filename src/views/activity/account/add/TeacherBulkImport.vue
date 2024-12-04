<template>
  <div class="import-button">
    <el-button type="success" @click="showImportDialog" style="margin-left: 10px;">
      批量导入<i class="el-icon-upload el-icon--right"></i>
    </el-button>

    <el-dialog
      title="批量导入教师账号"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      @closed="handleDialogClose"
      custom-class="import-dialog"
    >
      <div class="import-container">
        <!-- 步骤提示 -->
        <div class="steps-guide">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">选择学校</div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">上传文件</div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">开始导入</div>
          </div>
        </div>

        <!-- 学校选择 -->
        <div class="section school-select">
          <div class="section-title">
            <i class="el-icon-school"></i>
            选择学校
          </div>
          <el-select
            v-model="selectedSchool"
            placeholder="请选择要导入教师的学校"
            style="width: 100%"
            :disabled="isDisabled"
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
        </div>

        <!-- 文件上传区域 -->
        <div class="section upload-area">
          <div class="section-title">
            <i class="el-icon-upload"></i>
            上传Excel文件
          </div>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :show-file-list="true"
            :on-change="handleFileChange"
            :file-list="fileList"
            :before-upload="beforeUpload"
            accept=".xlsx,.xls"
          >
            <i class="el-icon-upload" style="font-size: 28px; color: #8c939d;"></i>
            <div class="el-upload__text">
              <em>点击上传</em>或将文件拖拽到此处
            </div>
            <div class="el-upload__tip">
              支持 .xlsx、.xls 格式，文件大小不超过2MB
            </div>
          </el-upload>
        </div>

        <!-- 底部提示和模板下载 -->
        <div class="bottom-tips">
          <el-alert
            title="请先下载模板，按照模板格式填写教师信息"
            type="info"
            :closable="false"
            show-icon>
          </el-alert>
          <div class="template-download">
            <el-button
              type="text"
              @click="downloadTemplate"
              icon="el-icon-download"
            >
              下载Excel模板
            </el-button>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleUpload"
          :loading="uploading"
          :disabled="!selectedFile || !selectedSchool"
        >
          {{ uploading ? '正在导入...' : '开始导入' }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
import { reqTeacherExcelImport } from '@/api/activity/account'; // 需要创建相应的API

export default {
  name: "TeacherBulkImport",
  computed: {
    isDisabled() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1";
    },
    ...mapState("school", ["schoolInfoList"]),
    schoolArray() {
      return this.schoolInfoList.map((school) => ({
        value: school.schoolId,
        label: school.schoolName,
      }));
    },
  },
  data() {
    return {
      dialogVisible: false,
      selectedSchool: "",
      selectedFile: null,
      fileList: [],
      uploading: false
    };
  },
  methods: {
    showImportDialog() {
      if (this.isDisabled) {
        this.selectedSchool = this.$store.getters.schoolId;
      }
      this.dialogVisible = true;
    },

    handleDialogClose() {
      this.selectedSchool = "";
      this.selectedFile = null;
      this.fileList = [];
      this.uploading = false;
    },

    handleFileChange(file) {
      this.selectedFile = file;
      this.fileList = [file];
    },

    beforeUpload(file) {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isExcel) {
        this.$message.error('只能上传Excel文件!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 2MB!');
        return false;
      }

      return true;
    },

    async handleUpload() {
      if (!this.selectedSchool || !this.selectedFile) {
        this.$message.warning('请选择学校并上传文件');
        return;
      }

      try {
        this.uploading = true;
        const formData = new FormData();
        formData.append('file', this.selectedFile.raw);
        formData.append('schoolId', this.selectedSchool.toString());

        const result = await reqTeacherExcelImport(formData);

        if (result.code === 200) {
          this.$message.success('教师账号导入成功');
          this.dialogVisible = false;
          // 刷新账号列表
          this.$emit('import-success');
        } else {
          this.$message.error(result.msg || '导入失败');
        }
      } catch (error) {
        console.error('导入错误：', error);
        this.$message.error('导入失败，请重试');
      } finally {
        this.uploading = false;
      }
    },

    downloadTemplate() {
      // 替换成实际的模板下载地址
      window.open('https://bilibilipropost.oss-cn-beijing.aliyuncs.com/teacher.xlsx', '_blank');
    }
  },
  mounted() {
    if (!this.schoolInfoList.length) {
      this.$store.dispatch("school/getSchoolInfoList");
    }
  }
};
</script>

<style scoped>
.import-dialog {
  border-radius: 8px;
}

.import-container {
  padding: 0 20px;
}

/* 步骤指引样式 */
.steps-guide {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px 40px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.step-text {
  font-size: 14px;
  color: #606266;
}

/* 分段样式 */
.section {
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #409EFF;
}

/* 上传区域样式 */
.upload-demo {
  display: flex;
  justify-content: center;
}

.el-upload-dragger {
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafcff;
  border: 1px dashed #c0c4cc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.el-upload-dragger:hover {
  border-color: #409EFF;
  background: #f5f7fa;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
  margin: 12px 0;
}

.el-upload__text em {
  color: #409EFF;
  font-style: normal;
  font-weight: 500;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
}

/* 底部提示区域 */
.bottom-tips {
  margin-top: 30px;
}

.template-download {
  margin-top: 12px;
  text-align: center;
}

/* 修改element-ui默认样式 */
:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 500;
}

:deep(.el-dialog__body) {
  padding: 20px 0;
}

:deep(.el-alert) {
  margin-bottom: 12px;
}
</style>
