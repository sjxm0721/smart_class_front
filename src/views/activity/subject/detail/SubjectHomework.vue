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
    <el-row :gutter="20">
      <el-col :span="8" v-for="homework in homeworks" :key="homework.id">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" :content="homework.title" placement="top">
              <span class="homework-title">{{ homework.title }}</span>
            </el-tooltip>
            <el-button v-if="auth === 2" type="text" size="small" @click.stop="showCompletionStatus(homework.id)">
              查看完成情况
            </el-button>
          </div>
          <div class="homework-content">
            <el-tooltip class="item" effect="dark" :content="homework.content" placement="top">
              <p class="homework-description">{{ homework.content }}</p>
            </el-tooltip>
            <p class="homework-deadline">
              <i class="el-icon-time"></i>
              <span>截止日期: {{ formatDate(homework.completeTime) }}</span>
            </p>
          </div>
          <div class="homework-actions">
            <el-button v-if="checkHomeworkBtn()" type="primary" size="small" @click.native="goToHomeworkDetail(homework.id)">查看作业</el-button>
            <el-button v-if="submitHomeworkBtn(homework)" type="primary" size="small" @click.native="goToHomeworkDetail(homework.id)">提交作业</el-button>
            <el-button v-if="allreadySubmitBtn(homework)" type="warning" size="small" disabled>已提交</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!homeworks.length" description="暂无作业"></el-empty>

    <!-- 作业完成情况对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="作业完成情况">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="已完成" name="completed">
          <el-table :data="completedStudents" style="width: 100%">
            <el-table-column prop="name" label="学生姓名"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未完成" name="incomplete">
          <el-table :data="incompleteStudents" style="width: 100%">
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
      incompleteStudents: []
    }
  },
  mounted() {
    this.fetchHomeworkList()
  },
  methods: {
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
.subject-homework .el-card {
  margin-bottom: 20px;
  //cursor: pointer;
}

.subject-homework .el-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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
}

.homework-deadline {
  margin-top: 10px;
  color: #999;
}

.homework-actions {
  margin-top: 20px;
  text-align: right;
}
</style>
