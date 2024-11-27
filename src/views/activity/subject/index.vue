<template>
  <div class="subject-list">
    <el-card class="box-card">
      <!-- 顶部搜索和添加区域 -->
      <div class="operation-area">
        <el-input
          v-model="searchText"
          placeholder="搜索课程"
          prefix-icon="el-icon-search"
          clearable
          @input="searchSubjects"
          class="search-input"
        >
        </el-input>

        <el-button
          v-if="isTeacher"
          type="primary"
          icon="el-icon-plus"
          @click="openPublish"
        >
          发布新课程
        </el-button>
      </div>

      <!-- 课程列表区域 -->
      <el-row :gutter="20" class="course-container">
        <el-col
          v-for="subject in displayList"
          :key="subject.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <subject-item :subject="subject" />
        </el-col>
      </el-row>

      <!-- 无数据提示 -->
      <el-empty
        v-if="displayList.length === 0"
        description="暂无课程数据">
      </el-empty>
    </el-card>

    <!-- 发布课程对话框 -->
    <publish-subject
      v-if="publishVisible"
      @close="closePublish"
      @publish-success="fetchSubjects"
    />
  </div>
</template>

<script>
import PublishSubject from './PublishSubject.vue'
import SubjectItem from './SubjectItem.vue'
import { reqGetSubjectInfoList } from '@/api/activity/subject'
import { mapState } from 'vuex'

export default {
  name: 'Subject',
  components: {
    PublishSubject,
    SubjectItem
  },
  data() {
    return {
      isTeacher: true,
      publishVisible: false,
      subjectList: [],
      displayList: [],
      searchText: ''
    }
  },
  computed: {
    ...mapState("user", ["accountId", "auth"]),
  },
  created() {
    this.fetchSubjects()
  },
  methods: {
    openPublish() {
      this.publishVisible = true
    },
    closePublish() {
      this.publishVisible = false
    },
    async fetchSubjects() {
      try {
        let subjectTotalInfo = {
          input: this.searchText,
          teacherId: null,
          studentId: null
        }
        if (this.auth == 0) {
          subjectTotalInfo.studentId = this.accountId
        }
        if (this.auth == 2) {
          subjectTotalInfo.teacherId = this.accountId
        }

        const res = await reqGetSubjectInfoList(subjectTotalInfo)
        if (res.code === 200) {
          this.subjectList = res.data.map(subject => ({
            ...subject,
            startTime: this.formatTimestamp(subject.startTime),
            endTime: this.formatTimestamp(subject.endTime)
          }))
          this.displayList = this.subjectList
        } else {
          this.$message.error('获取课程列表失败')
        }
      } catch (error) {
        console.error('获取课程列表出错:', error)
        this.$message.error('获取课程列表失败')
      }
    },
    searchSubjects() {
      if (!this.searchText) {
        this.displayList = this.subjectList
      } else {
        this.displayList = this.subjectList.filter(subject =>
          subject.title.toLowerCase().includes(this.searchText.toLowerCase())
        )
      }
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.subject-list {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.operation-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.course-container {
  margin-top: 20px;
}

/* 响应式布局调整 */
@media screen and (max-width: 768px) {
  .operation-area {
    flex-direction: column;
    gap: 10px;
  }

  .search-input {
    width: 100%;
  }
}
</style>
