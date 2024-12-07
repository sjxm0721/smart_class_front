<template>
  <div class="homework-detail">
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
      <div class="homework-info">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <div class="info-item">
              <i class="el-icon-time"></i>
              <span class="label">可见时间：</span>
              <span class="value">{{ formatTime(homework.sightedTime) }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="info-item">
              <i class="el-icon-timer"></i>
              <span class="label">截止时间：</span>
              <span class="value">{{ formatTime(homework.completeTime) }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="homework-content">
        <h3 class="section-title">
          <i class="el-icon-document"></i>
          作业内容
        </h3>
        <div class="content-wrapper" v-html="homework.content"></div>
      </div>

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
              <div class="resource-main">
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
          </div>
        </el-card>
      </div>

      <div class="homework-footer">
        <div class="submit-info">
          <div class="info-row">
            <span class="label">班级：</span>
            <span class="value">{{ homework.className }}</span>
          </div>
          <div class="info-row">
            <span class="label">提交情况：</span>
            <span class="value">已提交 {{ homework.curNum }}/{{ homework.totalNum }} 人</span>
          </div>
          <div class="info-row" v-if="homework.unCompleteStudentList">
            <span class="label">未提交学生：</span>
            <span class="value">{{ homework.unCompleteStudentList }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { reqGetHomeWorkInfo } from '@/api/activity/homework'

export default {
  name: 'HomeWorkDetail',
  data() {
    return {
      homework: {
        id: '',
        title: '',
        totalNum: 0,
        curNum: 0,
        content: '',
        resources: ''
      },
      resourceList: [],
      isMobile: false
    }
  },
  mounted() {
    this.fetchHomeworkDetail()
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    goBack() {
      this.$router.go(-1)
    },
    async fetchHomeworkDetail() {
      const homeworkId = this.$route.params.homeworkId
      try {
        const res = await reqGetHomeWorkInfo(homeworkId)
        if (res.code === 200) {
          this.homework = res.data
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
    formatTime(timestamp) {
      if (!timestamp) return '暂未设置'
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getFileName(url) {
      return url.substring(url.lastIndexOf('/') + 1)
    },
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
    canPreview(url) {
      const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
      const previewTypes = {
        'pdf': true,
        'jpg': true,
        'jpeg': true,
        'png': true,
        'gif': true
      }
      return previewTypes[ext] || false
    },
    previewResource(url) {
      const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
      const typeMap = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image'
      }

      this.$router.push({
        name: 'ResourceDetail',
        params: {
          resource: {
            name: this.getFileName(url),
            path: url,
            type: typeMap[ext] || 'unknown'
          }
        }
      })
    },
    downloadResource(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped>
.homework-detail {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .homework-detail {
    margin: 10px auto;
    padding: 0 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .back-button {
    margin-bottom: 10px;
  }

  .homework-title {
    font-size: 20px;
    line-height: 1.4;
  }

  .detail-card {
    margin-top: 10px;
  }

  .info-item {
    margin-bottom: 10px;
  }

  .section-title {
    font-size: 16px;
  }

  .content-wrapper {
    padding: 15px;
  }

  .resource-item {
    flex-direction: column;
    padding: 15px;
  }

  .resource-icon {
    margin-bottom: 10px;
    margin-right: 0;
  }

  .resource-info {
    width: 100%;
  }

  .resource-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .resource-name {
    word-break: break-all;
  }

  .resource-actions {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    gap: 15px;
  }

  .action-text {
    display: inline-block !important;
  }

  .submit-info .info-row {
    margin-bottom: 15px;
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
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
  line-height: 1.6;
}

.homework-resources {
  margin-bottom: 30px;
}

.resource-list {
  background-color: #f8f9fa;
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
}

.resource-main {
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
  white-space: nowrap;
}

.homework-footer {
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
  margin-top: 20px;
}

.submit-info .info-row {
  margin-bottom: 10px;
  color: #606266;
}

.submit-info .label {
  font-weight: 500;
  margin-right: 8px;
}

.el-button [class*="el-icon-"] + span {
  margin-left: 8px;
}
</style>
