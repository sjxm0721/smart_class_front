<template>
  <div class="resource-container">
    <div class="resource-content">
      <!-- 顶部搜索栏 -->
      <div class="operation-bar">
        <div class="search-area">
          <el-input
            v-model="searchInput"
            placeholder="请输入资源名称搜索"
            prefix-icon="el-icon-search"
            clearable
            size="small"
            @change="handleSearch"
            class="search-input"
          />
        </div>
        <div class="action-area">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="small"
            @click="showUploadDialog"
          >
            上传资源
          </el-button>
        </div>
      </div>

      <!-- 资源列表 -->
      <div class="table-container">
        <el-table
          :data="resourceList"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            prop="name"
            label="资源名称"
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.brief || '暂无简介'"
                placement="top-start"
                :open-delay="300"
              >
                <span class="resource-name">
                  <i class="el-icon-document resource-icon"></i>
                  {{ row.name }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="size" label="资源大小" width="120" align="center">
            <template slot-scope="{ row }">
              {{ formatFileSize(row.size) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="teacherName"
            label="上传教师"
            width="120"
            align="center"
          />

          <el-table-column
            prop="create_time"
            label="上传时间"
            width="180"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ formatTime(row.updateTime) }}
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-download"
                @click="handleDownload(row)"
              >
                下载
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <el-empty
          v-if="!loading && !resourceList.length"
          description="暂无资源"
        >
        </el-empty>
      </div>
      <el-dialog
        title="上传资源"
        :visible.sync="uploadDialogVisible"
        width="500px"
      >
        <el-form
          :model="uploadForm"
          :rules="uploadRules"
          ref="uploadForm"
          label-width="80px"
        >
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="uploadForm.name" placeholder="请输入资源名称"></el-input>
          </el-form-item>

          <el-form-item label="资源简介" prop="brief">
            <el-input
              type="textarea"
              v-model="uploadForm.brief"
              placeholder="请输入资源简介"
              :rows="3"
            ></el-input>
          </el-form-item>

          <el-form-item label="资源文件" prop="resources">
            <el-upload
              class="upload-area"
              action="/admin/common/upload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :on-remove="handleFileRemove"
              :before-upload="beforeUpload"
              :file-list="fileList"
              multiple
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">支持各类文档、图片、压缩包等格式，单个文件不超过20MB</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="uploading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqDownloadResources, reqGetResourceList, reqAddResource } from '@/api/activity/resource'

export default {
  name: 'SubjectResource',
  props: {
    subject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      searchInput: '',
      resourceList: [],
      uploadDialogVisible: false,
      uploading: false,
      fileList: [],
      uploadForm: {
        name: '',
        brief: '',
        resources: []
      },
      uploadRules: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        brief: [
          { max: 200, message: '简介不能超过200个字符', trigger: 'blur' }
        ],
        resources: [
          { required: true, message: '请上传资源文件', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchResourceList()
  },
  methods: {
    handleCancel() {
      this.uploadDialogVisible = false
    },
    // 获取资源列表
    async fetchResourceList() {
      this.loading = true
      try {
        // 这里替换为实际的API调用
        const response = await reqGetResourceList(this.$route.params.subjectId, this.searchInput)
        this.resourceList = response.data
      } catch (error) {
        this.$message.error('获取资源列表失败')
      } finally {
        this.loading = false
      }
    },

    // 处理搜索
    handleSearch() {
      this.fetchResourceList()
    },


    async handleDownload(resource) {
      try {
        this.$message.info('开始下载...')

        // 使用原生 axios 或修改 request 配置
        const response = await reqDownloadResources(resource.id)

        // 直接使用response，因为是二进制流
        const blob = new Blob([response], { type: 'application/zip' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        // 使用资源的实际名称
        link.setAttribute('download', `${resource.name}.zip`)
        document.body.appendChild(link)
        link.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)

        this.$message.success('下载完成')
      } catch (error) {
        console.error('下载失败:', error)
        this.$message.error('下载失败，请重试')
      }
    },


    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return '--'
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
    // 显示上传对话框
    showUploadDialog() {
      this.uploadDialogVisible = true
      this.uploadForm = {
        name: '',
        brief: '',
        resources: []
      }
      this.fileList = []
    },

    // 修改 formatFileSize 方法
    formatFileSize(sizeInKB) {
      if (!sizeInKB) return '0 KB';

      // 因为后端传来的size已经是KB单位，所以需要相应调整
      if (sizeInKB < 1024) {
        // 小于1MB，以KB为单位
        return sizeInKB.toFixed(2) + ' KB';
      } else if (sizeInKB < 1024 * 1024) {
        // 小于1GB，以MB为单位
        return (sizeInKB / 1024).toFixed(2) + ' MB';
      } else {
        // 大于1GB，以GB为单位
        return (sizeInKB / (1024 * 1024)).toFixed(2) + ' GB';
      }
    },

    // 处理文件上传成功
    handleUploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.uploadForm.resources.push(response.data)
        this.$message.success(`${file.name} 上传成功`)
      } else {
        this.$message.error(`${file.name} 上传失败`)
      }
    },

    // 处理文件上传失败
    handleUploadError(err, file) {
      this.$message.error(`${file.name} 上传失败`)
    },

    // 处理文件移除
    handleFileRemove(file) {
      const index = this.uploadForm.resources.indexOf(file.url)
      if (index !== -1) {
        this.uploadForm.resources.splice(index, 1)
      }
    },

    // 上传前验证
    beforeUpload(file) {
      const maxSize = 20 * 1024 * 1024 // 20MB
      if (file.size > maxSize) {
        this.$message.error('文件大小不能超过20MB')
        return false
      }
      return true
    },

    // 提交上传
    submitUpload() {
      this.$refs.uploadForm.validate(async valid => {
        if (!valid) return

        if (this.uploadForm.resources.length === 0) {
          this.$message.warning('请至少上传一个资源文件')
          return
        }

        this.uploading = true
        try {
          const params = {
            ...this.uploadForm,
            subjectId: this.subject.id,
            resources: this.uploadForm.resources.join(',')
          }

          console.log(params)
          const res = await reqAddResource(params)
          if (res.code === 200) {
            this.$message.success('资源上传成功')
            this.uploadDialogVisible = false
            this.fetchResourceList() // 刷新列表
          } else {
            this.$message.error(res.message || '上传失败')
          }
        } catch (error) {
          this.$message.error('上传失败，请重试')
        } finally {
          this.uploading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.resource-container {
  padding: 20px;
  height: 100%;
  background-color: #f5f7fa;
}

.resource-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-area {
  display: flex;
  align-items: center;
}

.search-input {
  width: 240px;
}

.table-container {
  margin-top: 20px;
}

/* 资源名称样式 */
.resource-name {
  display: flex;
  align-items: center;
  color: #606266;
}

.resource-icon {
  margin-right: 8px;
  color: #909399;
}

/* 表格样式优化 */
.el-table {
  margin-top: 15px;
}

.el-table ::v-deep th {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
}

.el-table ::v-deep .el-table__row:hover {
  background-color: #f5f7fa;
}

/* 下载按钮样式 */
.el-button [class*="el-icon-"] + span {
  margin-left: 4px;
}

/* 表格内按钮样式 */
.el-button--mini {
  padding: 7px 12px;
}

/* tooltip样式优化 */
.el-tooltip__popper {
  max-width: 300px;
  line-height: 1.5;
}

/* 空状态样式 */
.el-empty {
  padding: 40px 0;
}

/* 添加新的样式 */
.action-area {
  margin-left: 16px;
}

.upload-area {
  width: 100%;
}

.upload-area .el-upload-list {
  max-height: 200px;
  overflow-y: auto;
}

.el-upload__tip {
  line-height: 1.4;
  color: #909399;
  margin-top: 8px;
}
</style>
