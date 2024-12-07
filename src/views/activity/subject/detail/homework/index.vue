<template>
  <div class="homework-detail" :class="{ 'mobile': isMobile }">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="back-button">
        <el-button
          type="default"
          icon="el-icon-arrow-left"
          size="small"
          plain
          @click="goBack">
          返回
        </el-button>
      </div>
      <h2 class="homework-title">{{ homework.title }}</h2>
    </div>

    <el-card class="detail-card">
      <!-- 作业基本信息 -->
      <div class="homework-info">
        <el-row :gutter="isMobile ? 0 : 20">
          <el-col :span="isMobile ? 24 : 12" class="info-col">
            <div class="info-item">
              <i class="el-icon-time"></i>
              <span class="label">可见时间：</span>
              <span class="value">{{ formatTime(homework.sightedTime) }}</span>
            </div>
          </el-col>
          <el-col :span="isMobile ? 24 : 12" class="info-col">
            <div class="info-item">
              <i class="el-icon-timer"></i>
              <span class="label">截止时间：</span>
              <span class="value">{{ formatTime(homework.completeTime) }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 作业内容 -->
      <div class="homework-content">
        <h3 class="section-title">
          <i class="el-icon-document"></i>
          作业内容
        </h3>
        <div class="content-wrapper" v-html="homework.content"></div>
      </div>

      <!-- 附件资源 -->
      <div class="homework-resources" v-if="resourceList.length > 0">
        <h3 class="section-title">
          <i class="el-icon-folder"></i>
          附件资源
        </h3>
        <el-card shadow="never" class="resource-list">
          <div class="resource-item" v-for="(resource, index) in resourceList" :key="index">
            <div class="resource-icon">
              <i :class="getResourceIcon(resource)"></i>
            </div>
            <div class="resource-info">
              <span class="resource-name">{{ getFileName(resource) }}</span>
              <div class="resource-actions">
                <el-button
                  type="text"
                  size="small"
                  @click="downloadResource(resource)"
                >
                  <i class="el-icon-download"></i>
                  <span class="action-text">下载</span>
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="previewResource(resource)"
                  v-if="canPreview(resource)"
                >
                  <i class="el-icon-view"></i>
                  <span class="action-text">预览</span>
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="homework-actions">
        <el-button type="primary" icon="el-icon-download" @click="downloadHomework">
          下载作业
        </el-button>
      </div>

      <!-- 学生提交作业部分 -->
      <div v-if="auth === 0" class="submit-section">
        <h3 class="section-title">
          <i class="el-icon-edit-outline"></i>
          作业提交
        </h3>

        <!-- 编辑器 -->
        <div class="editor-wrapper">
          <div ref="toolbar" class="toolbar-container"></div>
          <div ref="editor" class="editor-container"></div>
        </div>

        <!-- 文件上传 -->
        <div class="upload-section">
          <h4 class="upload-title">
            <i class="el-icon-upload2"></i>
            附件上传
          </h4>
          <el-upload
            action="/admin/common/upload"
            :on-success="handleUploadSuccess"
            :file-list="fileList"
            :limit="5"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
            accept=".jpg,.png,.jpeg,.zip,.rar,.txt,.doc,.docx,.pdf,.mp3,.mp4"
            :on-error="handleUploadError"
            :on-preview="handlePreview"
            multiple
            class="upload-area"
          >
            <el-button size="small" type="primary">
              <i class="el-icon-upload2"></i>
              选择文件
            </el-button>
            <div slot="tip" class="el-upload__tip">
              支持常见格式文件，单个不超过20MB
            </div>
          </el-upload>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-actions">
          <el-button
            type="primary"
            size="medium"
            :loading="submitting"
            @click="submitHomework"
          >
            提交作业
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 文件预览对话框 -->
    <el-dialog
      :visible.sync="previewDialog.visible"
      :title="previewDialog.title"
      :width="isMobile ? '95%' : '50%'"
      class="preview-dialog">
      <div class="preview-content" v-html="previewDialog.content"></div>
    </el-dialog>
  </div>
</template>

<script>
import { reqGetHomeWorkInfo } from '@/api/activity/homework'
import { mapState } from 'vuex'
import E from 'wangeditor'
import { reqAddSubmit } from '@/api/activity/submit'

export default {
  name: 'SubjectHomeworkDetail',
  data() {
    return {
      isMobile: false,
      fileList: [], // 文件列表
      form: {
        resources: [] // 用于存储上传后的资源URL
      },
      submitting: false,
      saving: false,
      resourceList: [], // 添加资源列表数据
      homework: {
        id: '',
        title: '',
        totalNum: 0,
        curNum: 0,
        content: '',
        resources: []
      },
      editor: null,
      previewDialog: {
        visible: false,
        title: '',
        content: ''
      }
    }
  },
  computed: {
    ...mapState('user', ['accountId', 'auth'])
  },
  mounted() {
    this.fetchHomeworkDetail()
    this.checkDeviceWidth()
    window.addEventListener('resize', this.checkDeviceWidth)
    if (this.auth === 0) {
      this.initEditor()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDeviceWidth)
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  },
  methods: {
    checkDeviceWidth() {
      this.isMobile = window.innerWidth <= 768
    },
    async fetchHomeworkDetail() {
      const homeworkId = this.$route.params.homeworkId
      try {
        const res = await reqGetHomeWorkInfo(homeworkId)
        if (res.code === 200) {
          this.homework = res.data
          // 处理资源列表
          if (this.homework.resources) {
            this.resourceList = this.homework.resources.split(',')
          }
        } else {
          this.$message.error('获取作业详情失败')
        }
      } catch (error) {
        this.$message.error('获取作业详情失败')
      }
    },

    // 获取文件名
    getFileName(url) {
      return url.substring(url.lastIndexOf('/') + 1)
    },

    // 获取资源图标
    getResourceIcon(url) {
      const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
      const iconMap = {
        'pdf': 'el-icon-document',
        'doc': 'el-icon-document-copy',
        'docx': 'el-icon-document-copy',
        'jpg': 'el-icon-picture',
        'jpeg': 'el-icon-picture',
        'png': 'el-icon-picture',
        'gif': 'el-icon-picture'
      }
      return iconMap[ext] || 'el-icon-document'
    },

    // 判断是否可以预览
    canPreview(url) {
      const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
      return ['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(ext)
    },

    // 资源预览
    previewResource(url) {
      const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
      const typeMap = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image'
      };

      this.$router.push({
        name: 'ResourceDetail',
        params: {
          resource: {
            name: this.getFileName(url),
            path: url,
            type: typeMap[ext] || 'unknown'  // 添加type参数
          }
        }
      });
    },

    // 资源下载
    downloadResource(url) {
      window.open(url, '_blank')
    },
    handleUploadSuccess(response, file, fileList) {
      this.form.resources.push(response.data)
      this.fileList = fileList
    },

    handleUploadError(err, file, fileList) {
      this.$message.error(`文件 ${file.name} 上传失败: ${err.message}`)
    },

    handlePreview(file) {
      window.open(file.url, '_blank')
    },

    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件,本次选择了 ${files.length} 个文件,共选择了 ${files.length + fileList.length} 个文件`)
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    async submitHomework() {
      if (!this.editor.txt.html()) {
        this.$message.warning('请输入作业内容')
        return
      }
      if(this.auth!=0){
        return
      }

      this.submitting = true
      try {
        const submitData = {
          homeworkId: this.homework.id,
          content: this.editor.txt.html(),
          resources: this.form.resources, // 修改为使用form中的resources
          studentId:this.accountId
        }

        const response = await reqAddSubmit(submitData)
        if (response.code === 200) {
          this.$message.success('作业提交成功')
          this.$router.go(-1)
        } else {
          this.$message.error(response.message || '提交失败')
        }
      } catch (error) {
        this.$message.error('提交失败，请重试')
      } finally {
        this.submitting = false
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    formatTime(timestamp) {
      if (!timestamp) return '暂未设置'
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    downloadHomework() {
      const homeworkUrl = `/api/homework/${this.homework.id}/download`
      window.open(homeworkUrl, '_blank')
    },

    // 初始化编辑器
    initEditor() {
      const editor = new E(this.$refs.toolbar, this.$refs.editor)

      // 移动端特殊配置
      if (this.isMobile) {
        editor.config.height = 300
        editor.config.menus = [
          'head',
          'bold',
          'fontSize',
          'fontName',
          'italic',
          'underline',
          'strikeThrough',
          'indent',
          'lineHeight',
          'foreColor',
          'backColor',
          'link',
          'list',
          'justify',
          'quote',
          'image',
          'table',
          'code',
          'undo',
          'redo',
        ]
      }

      // 其他配置保持不变
      editor.config.placeholder = '请在此输入作业内容...'
      editor.config.zIndex = 100
      editor.config.uploadImgServer = '/api/file/upload/image'
      editor.config.uploadImgMaxSize = 5 * 1024 * 1024
      editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif']

      editor.create()
      this.editor = editor
    },

    // 文件上传相关方法
    handleFilePreview(file) {
      this.previewDialog.title = file.name
      // 根据文件类型处理预览内容
      this.previewDialog.visible = true
    },

    handleFileRemove(file, fileList) {
      this.fileList = fileList
    },

    handleFileSuccess(response, file, fileList) {
      this.fileList = fileList
      this.$message.success('文件上传成功')
    },

    handleFileError(err) {
      this.$message.error('文件上传失败')
    },

    beforeFileUpload(file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/x-rar-compressed', 'application/zip']
      const isValidType = validTypes.includes(file.type)
      const isLt20M = file.size / 1024 / 1024 < 20

      if (!isValidType) {
        this.$message.error('请上传正确的文件格式！')
        return false
      }
      if (!isLt20M) {
        this.$message.error('文件大小不能超过 20MB！')
        return false
      }
      return true
    },

  }
}
</script>


<style scoped>
.homework-detail {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  margin-right: 20px;
}

.homework-title {
  font-size: 24px;
  margin: 0;
  color: #303133;
  flex: 1;
}

.detail-card {
  background-color: #fff;
  border-radius: 8px;
}

.homework-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.info-item {
  display: flex;
  align-items: center;
  color: #606266;
}

.info-item i {
  margin-right: 8px;
  color: #909399;
}

.info-item .label {
  font-weight: 500;
  margin-right: 8px;
}

.section-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 8px;
  color: #409EFF;
}

.content-wrapper {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;
}

.content-wrapper pre {
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin: 0;
  font-family: inherit;
}

.homework-resources {
  margin-bottom: 30px;
}

.resource-list {
  background-color: #f8f9fa;
}

.resource-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.resource-list li {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.resource-list li:last-child {
  margin-bottom: 0;
}

.resource-list i {
  margin-right: 8px;
  color: #909399;
}

.resource-list a {
  color: #409EFF;
  text-decoration: none;
}

.resource-list a:hover {
  color: #66b1ff;
}

.homework-actions {
  text-align: right;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.el-button [class*="el-icon-"] + span {
  margin-left: 8px;
}

/* 新增样式 */
.submit-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.toolbar-container {
  border: 1px solid #dcdfe6;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.editor-container {
  border: 1px solid #dcdfe6;
  border-top: none;
  border-radius: 0 0 4px 4px;
  min-height: 400px;
  margin-bottom: 20px;
}

.upload-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.upload-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
}

.upload-title i {
  margin-right: 8px;
  color: #409EFF;
}

.upload-area {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.el-upload__tip {
  color: #909399;
  margin-top: 8px;
  line-height: 1.4;
}

.submit-actions {
  margin-top: 30px;
  text-align: center;
}

.submit-actions .el-button {
  min-width: 120px;
  margin: 0 10px;
}

.preview-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
}

/* 编辑器样式优化 */
:deep(.w-e-text-container) {
  min-height: 400px !important;
}

:deep(.w-e-toolbar) {
  background-color: #f8f9fa !important;
  border-bottom: 1px solid #dcdfe6 !important;
}

.resource-list {
  background-color: #f8f9fa;
  padding: 10px;
}

.resource-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

.resource-item:last-child {
  border-bottom: none;
}

.resource-icon {
  font-size: 24px;
  margin-right: 15px;
  color: #909399;
}

.resource-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resource-name {
  color: #606266;
  flex: 1;
}

.resource-actions {
  display: flex;
  gap: 10px;
}

.homework-detail {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 移动端样式 */
@media screen and (max-width: 768px) {
  .homework-detail {
    margin: 10px auto;
    padding: 0 10px;
  }

  .homework-detail.mobile .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .homework-detail.mobile .back-button {
    margin-right: 0;
  }

  .homework-detail.mobile .homework-title {
    font-size: 18px;
  }

  .homework-detail.mobile .detail-card {
    padding: 10px;
  }

  .homework-detail.mobile .info-col {
    margin-bottom: 10px;
  }

  .homework-detail.mobile .info-item {
    font-size: 14px;
  }

  .homework-detail.mobile .section-title {
    font-size: 16px;
  }

  .homework-detail.mobile .content-wrapper {
    padding: 15px;
  }

  .homework-detail.mobile .resource-item {
    flex-direction: column;
    gap: 10px;
  }

  .homework-detail.mobile .resource-info {
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }

  .homework-detail.mobile .resource-name {
    font-size: 14px;
    word-break: break-all;
  }

  .homework-detail.mobile .resource-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .homework-detail.mobile .action-text {
    font-size: 13px;
  }

  .homework-detail.mobile .editor-wrapper {
    margin-top: 15px;
  }

  .homework-detail.mobile .toolbar-container {
    border-radius: 4px 4px 0 0;
  }

  .homework-detail.mobile .editor-container {
    height: 300px;
    border-radius: 0 0 4px 4px;
  }

  .homework-detail.mobile .upload-section {
    padding: 15px;
  }

  .homework-detail.mobile .upload-title {
    font-size: 14px;
  }

  .homework-detail.mobile .el-upload__tip {
    font-size: 12px;
  }

  .homework-detail.mobile .submit-actions {
    margin-top: 20px;
  }

  .homework-detail.mobile .submit-actions .el-button {
    width: 100%;
  }
}

/* 保持原有的其他样式... */
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

</style>


