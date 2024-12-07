<template>
  <div class="subject-homework">
    <div class="homework-header">
      <h3 class="homework-title-main">作业列表</h3>
      <el-button
        v-if="auth === 2"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="goToAddHomework">
        布置作业
      </el-button>
    </div>

    <!-- 使用动态的栅格布局 -->
    <el-row :gutter="isMobile ? 10 : 20">
      <el-col
        :span="isMobile ? 24 : 8"
        v-for="homework in homeworks"
        :key="homework.id"
        class="homework-col">
        <el-card shadow="hover" class="homework-card">
          <div slot="header" class="clearfix homework-card-header">
            <el-tooltip class="item" effect="dark" :content="homework.title" placement="top" :disabled="isMobile">
              <span class="homework-title">{{ homework.title }}</span>
            </el-tooltip>
            <el-button
              v-if="auth === 2"
              type="text"
              size="small"
              @click.stop="showCompletionStatus(homework.id)"
              class="completion-btn">
              <i class="el-icon-view"></i>
              <span class="btn-text">查看完成情况</span>
            </el-button>
          </div>

          <div class="homework-content">
            <el-tooltip class="item" effect="dark" :content="homework.content" placement="top" :disabled="isMobile">
              <p class="homework-description">{{ homework.content }}</p>
            </el-tooltip>
            <p class="homework-deadline">
              <i class="el-icon-time"></i>
              <span>截止日期: {{ formatDate(homework.completeTime) }}</span>
            </p>
          </div>

          <div class="homework-actions">
            <el-button
              v-if="checkHomeworkBtn()"
              type="primary"
              size="small"
              @click.native="goToHomeworkDetail(homework.id)">
              查看作业
            </el-button>
            <el-button
              v-if="submitHomeworkBtn(homework)"
              type="primary"
              size="small"
              @click.native="goToHomeworkDetail(homework.id)">
              提交作业
            </el-button>
            <el-button
              v-if="allreadySubmitBtn(homework)"
              type="warning"
              size="small"
              disabled>
              已提交
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="!homeworks.length" description="暂无作业"></el-empty>

    <!-- 作业完成情况对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="作业完成情况"
      :width="isMobile ? '95%' : '50%'"
      class="completion-dialog">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="已完成" name="completed">
          <el-table
            :data="completedStudents"
            style="width: 100%"
            :size="isMobile ? 'mini' : 'medium'">
            <el-table-column prop="name" label="学生姓名"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未完成" name="incomplete">
          <el-table
            :data="incompleteStudents"
            style="width: 100%"
            :size="isMobile ? 'mini' : 'medium'">
            <el-table-column prop="name" label="学生姓名"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { reqGetHomeWorkList } from '@/api/activity/homework'

export default {
  name: 'SubjectHomework',
  computed: {
    ...mapState('user', ['accountId', 'auth'])
  },
  props: ['subject'],
  data() {
    return {
      homeworks: [],
      dialogVisible: false,
      activeTab: 'completed',
      completedStudents: [],
      incompleteStudents: [],
      isMobile: false
    }
  },
  mounted() {
    this.fetchHomeworkList()
    this.checkDeviceWidth()
    window.addEventListener('resize', this.checkDeviceWidth)
  },
  destroyed() {
    window.removeEventListener('resize', this.checkDeviceWidth)
  },
  methods: {
    checkDeviceWidth() {
      this.isMobile = window.innerWidth <= 768
    },
    // 保持其他现有方法不变...
    formatDate(dateStr) {
      if (!dateStr) return '未设置'

      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    async fetchHomeworkList() {
      let studentId = null
      if(this.auth==0){
        studentId = this.accountId
      }
      reqGetHomeWorkList(this.$route.params.subjectId,studentId).then((res) => {
        if (res.code == 200) {
          this.homeworks = res.data
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    checkHomeworkBtn(){
      if(this.auth==2){
        return true;
      }
      else{
        return false;
      }
    },
    submitHomeworkBtn(homework){
      if(this.auth==0&&homework.sstatus==0){
        return true;
      }
      else{
        return false;
      }
    },
    allreadySubmitBtn(homework){
      if(this.auth==0&&homework.sstatus==1){
        return true;
      }
      else{
        return false;
      }
    },
    goToHomeworkDetail(homeworkId) {
      this.$router.push({
        name: 'SubjectHomeworkDetail',
        params: {
          subjectId: this.subject.id,
          homeworkId: homeworkId
        }
      })
    },
    goToAddHomework() {
      this.$router.push({
        name: 'SubjectHomeworkAdd',
        params: {
          subjectId: this.subject.id
        }
      })
    },
    showCompletionStatus(homeworkId) {
      this.completedStudents = [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' }
      ]
      this.incompleteStudents = [
        { id: 3, name: '王五' },
        { id: 4, name: '赵六' }
      ]
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.subject-homework {
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .subject-homework {
    padding: 10px;
  }

  .homework-title-main {
    font-size: 18px !important;
  }

  .homework-col {
    padding-bottom: 10px;
  }

  .homework-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .homework-title {
    font-size: 16px;
    display: block;
    width: 100%;
  }

  .completion-btn {
    padding: 0;
  }

  .completion-btn .btn-text {
    font-size: 13px;
  }

  .homework-description {
    max-height: 60px;
    overflow-y: auto;
    white-space: normal;
    word-break: break-all;
  }

  .homework-deadline {
    font-size: 13px;
  }

  .homework-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .homework-actions .el-button {
    margin-left: 0;
    flex: 0 0 auto;
  }
}

/* 桌面端样式 */
.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.homework-title-main {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.homework-card {
  margin-bottom: 20px;
  height: 100%;
}

.homework-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.homework-title {
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.homework-content {
  margin-top: 10px;
}

.homework-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
  color: #666;
}

.homework-deadline {
  margin-top: 10px;
  color: #999;
}

.homework-deadline i {
  margin-right: 5px;
}

.homework-actions {
  margin-top: 20px;
  text-align: right;
}

/* Dialog样式 */
.completion-dialog {
  max-width: 90vw;
}

.completion-dialog .el-dialog__body {
  padding: 10px 20px;
}

@media screen and (max-width: 768px) {
  .completion-dialog .el-dialog {
    width: 95% !important;
    margin-top: 20vh !important;
  }

  .completion-dialog .el-dialog__body {
    padding: 10px;
  }
}
</style>
