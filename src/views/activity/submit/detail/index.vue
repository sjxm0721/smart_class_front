<template>
  <div class="submit-detail">
    <div class="page-header">
      <div class="back-button">
        <el-button type="default" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
      </div>
      <h2 class="page-title">作业提交详情</h2>
    </div>

    <!-- 基本信息卡片 -->
    <el-card class="detail-card info-card">
      <div slot="header" class="card-header">
        <span class="header-title">
          <i class="el-icon-info"></i> 基本信息
        </span>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8">
          <div class="info-item">
            <span class="label">作业标题：</span>
            <span class="value">{{ submitInfo.homeworkTitle }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8">
          <div class="info-item">
            <span class="label">提交学生：</span>
            <span class="value">{{ submitInfo.studentName }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8">
          <div class="info-item">
            <span class="label">提交时间：</span>
            <span class="value">{{ formatTime(submitInfo.submitTime) }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-20">
        <el-col :xs="24" :sm="8">
          <div class="info-item">
            <span class="label">所属课程：</span>
            <span class="value">{{ submitInfo.subjectName }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8">
          <div class="info-item">
            <span class="label">批改状态：</span>
            <el-tag :type="submitInfo.isCorrected ? 'success' : 'warning'" size="small">
              {{ submitInfo.isCorrected ? '已批改' : '未批改' }}
            </el-tag>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8">
          <div class="info-item" v-if="submitInfo.isCorrected">
            <span class="label">最终得分：</span>
            <span class="value score">{{ submitInfo.score }} 分</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 作业内容卡片 -->
    <el-card class="detail-card content-card">
      <div slot="header" class="card-header">
        <span class="header-title">
          <i class="el-icon-document"></i> 作业内容
        </span>
      </div>
      <div class="content-viewer" v-html="submitInfo.content"></div>
    </el-card>

    <!-- 附件资源卡片 -->
    <el-card class="detail-card resource-card" v-if="submitInfo.resources">
      <div slot="header" class="card-header">
        <span class="header-title">
          <i class="el-icon-folder"></i> 附件资源
        </span>
      </div>
      <div class="resource-list">
        <div v-for="(resource, index) in parsedResources" :key="index" class="resource-item">
          <div class="resource-info">
            <span class="resource-icon" :class="getResourceIconClass(resource.type)"></span>
            <span class="resource-name">{{ resource.name }}</span>
          </div>
          <div class="resource-actions">
            <el-button type="text" @click="previewResource(resource)" size="mini">
              <i class="el-icon-view"></i>
              <span class="action-text">预览</span>
            </el-button>
            <el-button type="text" @click="downloadResource(resource)" size="mini">
              <i class="el-icon-download"></i>
              <span class="action-text">下载</span>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 教师评价区域 -->
    <el-card class="detail-card comment-card" v-if="auth === 2 || (auth === 0 && submitInfo.isCorrected)">
      <div slot="header" class="card-header">
        <span class="header-title">
          <i class="el-icon-chat-line-square"></i> 教师评价
        </span>
      </div>

      <!-- 教师视角：可以评分和评价 -->
      <template v-if="auth === 2">
        <div class="previous-comment" v-if="submitInfo.score">
          <div class="history-title">历史评分：</div>
          <div class="history-content">{{ submitInfo.score }}</div>
        </div>
        <div class="previous-comment" v-if="submitInfo.comment">
          <div class="history-title">历史评价：</div>
          <div class="history-content">{{ submitInfo.comment }}</div>
        </div>

        <div class="comment-form">
          <el-form :model="commentForm" ref="commentForm" :label-width="isMobile ? '60px' : '80px'">
            <el-form-item label="评分">
              <div class="score-input-group">
                <el-input-number
                  v-model="commentForm.score"
                  :min="0"
                  :max="100"
                  :precision="2"
                  :step="0.5"
                  size="small"
                  @change="handleScoreChange"
                >
                </el-input-number>
                <div class="score-tip">
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover"
                    popper-class="score-tip-popover"
                  >
                    <div class="score-rule">
                      <div class="rule-title">评分规则：</div>
                      <div class="rule-item">
                        <div class="rule-range">0-60分：</div>
                        <el-tag size="mini" type="danger">不及格</el-tag>
                      </div>
                      <div class="rule-item">
                        <div class="rule-range">60-90分：</div>
                        <el-tag size="mini" type="success">及格</el-tag>
                      </div>
                      <div class="rule-item">
                        <div class="rule-range">90-100分：</div>
                        <el-tag size="mini" type="primary">优秀</el-tag>
                      </div>
                    </div>
                    <el-button slot="reference" type="text" class="tip-trigger">
                      <i class="el-icon-question"></i>
                      评分说明
                    </el-button>
                  </el-popover>
                  <span class="current-level" :class="scoreLevelClass">
                    {{ scoreLevel }}
                  </span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="评语">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入评语"
                v-model="commentForm.comment">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitComment" :loading="submitting">
                {{ submitInfo.isCorrected ? '更新评价' : '提交评价' }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>

      <!-- 学生视角：只能查看评价 -->
      <template v-else>
        <div class="score-display" v-if="submitInfo.score">
          <el-rate
            v-model="scoreRate"
            disabled
            show-score
            score-template="{value}分">
          </el-rate>
        </div>
        <div class="comment-display" v-if="submitInfo.comment">
          {{ submitInfo.comment }}
        </div>
        <el-empty v-else description="暂无评价"></el-empty>
      </template>
    </el-card>
  </div>
</template>

<script>
import E from 'wangeditor'
import ResourcePreview from '@/views/activity/resource/detail' // 引入资源预览组件
import { reqGetSubmitInfo, reqGiveComment } from '@/api/activity/submit'
import { mapState } from 'vuex'
import { reqDownloadResourcesByName } from '@/api/activity/resource'

export default {
  name: 'SubmitDetail',
  components: {
    ResourcePreview
  },
  data() {
    return {
      submitInfo: {},
      editor: null,
      commentForm: {
        score: 0,
        comment: ''
      },
      submitting: false,
      previewDialogVisible: false,
      isFullscreen: false,
      isMobile: false,
      currentResource: null,
      parsedResources: []
    }
  },
  computed: {
    ...mapState('user', ['accountId', 'auth']),
    scoreRate() {
      return this.submitInfo.score ? this.submitInfo.score / 20 : 0
    },
    scoreLevel() {
      const score = this.commentForm.score;
      if (score < 60) return '不及格';
      if (score < 90) return '及格';
      return '优秀';
    },

    scoreLevelClass() {
      const score = this.commentForm.score;
      return {
        'level-fail': score < 60,
        'level-pass': score >= 60 && score < 90,
        'level-excellent': score >= 90
      };
    }
  },
  mounted() {
    this.fetchSubmitDetail()
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.fetchSubmitDetail()
  },
  beforeDestroy() {
    // if (this.editor) {
    //   this.editor.destroy()
    // }
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    async fetchSubmitDetail() {
      try {
        const submitId = this.$route.params.submitId
        const res = await reqGetSubmitInfo(submitId)
        if (res.code === 200) {
          this.submitInfo = res.data
          this.parseResources()

          // 如果是教师且有历史评价，初始化表单
          if (this.auth === 2 && this.submitInfo.isCorrected) {
            this.commentForm.score = this.submitInfo.score || 0
            this.commentForm.comment = this.submitInfo.comment || ''
          }
        }
      } catch (error) {
        this.$message.error('获取提交详情失败')
      }
    },

    initContentViewer() {
      const editor = new E(this.$refs.contentViewer)
      editor.config.readOnly = true
      editor.create()
      editor.txt.html(this.submitInfo.content || '')
      this.editor = editor
    },

    parseResources() {
      if (this.submitInfo.resources) {
        // 这里需要根据实际的资源数据结构进行解析
        // 示例：将资源字符串转换为对象数组
        const resources = this.submitInfo.resources.split(',')
        this.parsedResources = resources.map(url => {
          const name = url.substring(url.lastIndexOf('/') + 1)
          const type = this.getResourceType(name)
          let path = url
          return { name, path, type }
        })
      }
    },

    getResourceType(filename) {
      const ext = filename.split('.').pop().toLowerCase()
      const typeMap = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'txt': 'text',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image'
      }
      return typeMap[ext] || 'unknown'
    },

    getResourceIconClass(type) {
      const iconMap = {
        'pdf': 'el-icon-document',
        'doc': 'el-icon-document-copy',
        'text': 'el-icon-document-text',
        'image': 'el-icon-picture'
      }
      return iconMap[type] || 'el-icon-document'
    },

    previewResource(resource) {
      // this.currentResource = resource
      // this.previewDialogVisible = true
      this.$router.push({ name: 'ResourceDetail', params: { resource: resource } });
    },

    // vue 文件中的 downloadResource 方法修改
    async downloadResource(resource) {
      const loading = this.$loading({
        lock: true,
        text: '正在下载文件...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        const response = await reqDownloadResourcesByName(resource.name, resource.path);

        // 从响应头获取文件类型
        const contentType = 'application/octet-stream'; // 如果后端没有设置，使用通用的二进制流

        // 创建blob
        const blob = new Blob([response], { type: contentType });

        // 创建临时URL
        const url = window.URL.createObjectURL(blob);

        // 创建隐藏的a标签用于下载
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', resource.name);

        // 添加到body
        document.body.appendChild(link);

        // 触发点击
        link.click();

        // 清理
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        this.$message.success('下载成功');
      } catch (error) {
        console.error('Download error:', error);
        this.$message.error('下载失败，请重试');
      } finally {
        loading.close();
      }
    },

    closePreview() {
      this.previewDialogVisible = false
      this.currentResource = null
    },

    async submitComment() {
      if (this.submitting) return

      try {
        this.submitting = true
        // 调用保存评价的API
        const params = {
          id: this.submitInfo.id,
          score: this.commentForm.score,
          comment: this.commentForm.comment
        }
        const res = await reqGiveComment(params)
        this.$message.success('评价保存成功')
        this.fetchSubmitDetail() // 重新加载数据
      } catch (error) {
        this.$message.error('评价保存失败')
      } finally {
        this.submitting = false
      }
    },

    goBack() {
      this.$router.go(-1)
    },

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
    handleScoreChange(value) {
      if (value < 0 || value > 100) {
        this.$message({
          message: '请输入0-100之间的分数',
          type: 'warning'
        });
        // 自动修正分数范围
        this.commentForm.score = Math.max(0, Math.min(100, value));
      }
    }
  }
}
</script>

<style scoped>
.submit-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 移动端适配样式 */
@media screen and (max-width: 768px) {
  .submit-detail {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .back-button {
    margin-bottom: 10px;
  }

  .page-title {
    font-size: 20px;
  }

  .info-item {
    margin-bottom: 15px;
  }

  .score-input-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .score-tip {
    margin-top: 10px;
  }

  .resource-item {
    flex-direction: column;
    gap: 10px;
  }

  .resource-info {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .resource-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .comment-form {
    max-width: 100%;
  }

  .el-form-item {
    margin-bottom: 20px;
  }
}

/* 保持原有的基础样式 */
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  margin-right: 20px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.header-title i {
  margin-right: 8px;
  color: #409EFF;
}

.info-item {
  margin-bottom: 10px;
}

.info-item .label {
  color: #909399;
  margin-right: 8px;
}

.info-item .value {
  color: #303133;
}

.info-item .score {
  color: #f56c6c;
  font-weight: bold;
}

.mt-20 {
  margin-top: 20px;
}

.content-viewer {
  padding: 20px;
  min-height: 200px;
  background-color: #fff;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  line-height: 1.6;
}

.content-viewer >>> p {
  margin-bottom: 1em;
}

.content-viewer >>> img {
  max-width: 100%;
  height: auto;
}


.resource-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resource-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.resource-icon {
  font-size: 20px;
  margin-right: 10px;
  color: #909399;
}

.resource-name {
  flex: 1;
  color: #606266;
}

.resource-actions {
  display: flex;
  gap: 10px;
}

.previous-comment {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.history-title {
  color: #909399;
  margin-bottom: 8px;
}

.history-content {
  color: #606266;
  line-height: 1.6;
}

.comment-form {
  max-width: 500px;
}

.score-display {
  margin-bottom: 20px;
}

.comment-display {
  line-height: 1.6;
  color: #606266;
}

.preview-dialog {
  display: flex;
  flex-direction: column;
}

/* 在 style 部分添加 */
.score-input-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score-tip {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tip-trigger {
  padding: 0;
  font-size: 13px;
}

.tip-trigger i {
  margin-right: 4px;
  color: #909399;
}

.score-rule {
  font-size: 13px;
}

.rule-title {
  margin-bottom: 8px;
  color: #606266;
  font-weight: bold;
}

.rule-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.rule-range {
  width: 70px;
  color: #909399;
}

.current-level {
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 3px;
}

.level-fail {
  color: #F56C6C;
  background-color: #FEF0F0;
}

.level-pass {
  color: #67C23A;
  background-color: #F0F9EB;
}

.level-excellent {
  color: #409EFF;
  background-color: #ECF5FF;
}

/* 自定义 popover 样式 */
:deep(.score-tip-popover) {
  padding: 12px;
}

:deep(.el-popover__title) {
  font-weight: bold;
}

.resource-preview-dialog {
  z-index: 3000 !important;
}

:deep(.el-dialog__wrapper) {
  z-index: 3000 !important;
}

:deep(.v-modal) {
  z-index: 2999 !important;
}

.resource-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.resource-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.resource-name {
  word-break: break-all;
}

.resource-actions {
  display: flex;
  gap: 15px;
}

.action-text {
  margin-left: 4px;
}

.score-input-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score-tip {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
