# Template 部分
<template>
  <div class="subject-intro">
    <el-card class="intro-card">
      <!-- 顶部操作区域 -->
      <div class="operation-area">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-download"
          :loading="exporting"
          @click="exportGrades"
        >
          {{ exporting ? '导出中...' : '导出学生成绩' }}
        </el-button>
      </div>

      <!-- 课程头部信息区域 -->
      <div class="course-header">
        <div class="course-cover">
          <el-image
            :src="subject.pic"
            fit="cover"
            class="cover-image"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
        <div class="course-basic-info">
          <h1 class="course-title">{{ subject.title }}</h1>
          <div class="info-tags-container">
            <div class="info-tags">
              <el-tag size="medium" type="info" effect="plain" class="tag-item">
                <i class="el-icon-user"></i>
                教师：{{ subject.teacherName }}
              </el-tag>
              <el-tag size="medium" type="success" effect="plain" class="tag-item">
                <i class="el-icon-school"></i>
                班级：{{ subject.className }}
              </el-tag>
              <el-tag size="medium" type="warning" effect="plain" class="tag-item">
                <i class="el-icon-date"></i>
                结课时间：{{ formatDate(subject.endTime) }}
              </el-tag>
            </div>
          </div>
          <div class="course-brief">
            <p>{{ subject.brief }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

# Script 部分
<script>
import { reqGetSubjectInfo,reqExportGrades} from '@/api/activity/subject'

export default {
  name: 'SubjectIntro',
  data() {
    return {
      activeMenu: 'intro',
      hasOutline: false,
      hasResources: false,
      hasHomework: false,
      subject: null,
      exporting: false
    }
  },
  mounted() {
    this.fetchSubjectInfo()
  },
  methods: {
    async fetchSubjectInfo() {
      try {
        let subjectId = this.$route.params.subjectId
        const res = await reqGetSubjectInfo(subjectId)
        if (res.code === 200) {
          this.subject = res.data
        }
      } catch (error) {
        this.$message.error('获取课程信息失败')
      }
    },
    async exportGrades() {
      if (!this.subject?.id) {
        this.$message.warning('课程信息未加载完成')
        return
      }

      try {
        this.exporting = true
        reqExportGrades(this.subject.id).then((res)=>{
          // 创建一个下载链接
          const url = window.URL.createObjectURL(new Blob([res]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${this.subject.title}-学生成绩.xlsx`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          this.$message.success('成绩导出成功')
        }).catch((err)=>{
          this.$message.error('导出失败')
        })
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败，请稍后重试')
      } finally {
        this.exporting = false
      }
    },
    handleSelect(key) {
      this.activeMenu = key
    },
    formatDate(dateStr) {
      if (!dateStr) return '未设置'
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

# Style 部分
<style scoped>
.subject-intro {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 40px);
}

.intro-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
}

/* 新增操作区域样式 */
.operation-area {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding: 0 10px;
}

.course-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.course-cover {
  flex: 0 0 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.cover-image {
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
  object-fit: cover;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.course-basic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 24px;
  color: #303133;
  margin: 0 0 20px 0;
}

.info-tags-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

.info-tags {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.tag-item {
  padding: 8px 15px;
  display: flex;
  align-items: center;
  margin: 0;
}

.tag-item i {
  margin-right: 5px;
}

.course-brief {
  color: #606266;
  line-height: 1.8;
  font-size: 14px;
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .course-header {
    flex-direction: column;
  }

  .course-cover {
    flex: none;
    width: 100%;
  }

  .info-tags {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .tag-item {
    width: 100%;
    justify-content: center;
  }

  .operation-area {
    margin-bottom: 15px;
  }
}
</style>
