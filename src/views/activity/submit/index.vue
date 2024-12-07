<template>
  <div class="submit-page">
    <h2 class="page-title">学生作业提交</h2>

    <!-- 搜索和筛选条件 -->
    <div class="filters">
      <el-input
        v-model="searchText"
        placeholder="搜索作业内容"
        clearable
        class="search-input"
      ></el-input>
      <el-select
        v-model="selectedStatus"
        placeholder="选择批改状态"
        class="status-select"
      >
        <el-option label="全部状态" value=""></el-option>
        <el-option label="未批改" value="0"></el-option>
        <el-option label="已批改" value="1"></el-option>
      </el-select>
      <el-button
        type="primary"
        @click="fetchSubmits"
        class="search-button"
      >搜索</el-button>
    </div>

    <!-- PC端表格视图 -->
    <div v-if="!isMobile" class="table-view">
      <el-table :data="submits" style="width: 100%">
        <el-table-column prop="homeworkTitle" label="作业标题" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="subjectName" label="课程" min-width="120"></el-table-column>
        <el-table-column prop="studentName" v-if="auth==2" label="学生姓名" min-width="120"></el-table-column>
        <el-table-column prop="submitTime" label="提交时间" min-width="160"></el-table-column>
        <el-table-column label="批改状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isCorrected ? 'success' : 'warning'">
              {{ scope.row.isCorrected ? '已批改' : '未批改' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评分" width="100">
          <template slot-scope="scope">
            {{ scope.row.score ? scope.row.score : '暂无评分' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 移动端卡片视图 -->
    <div v-else class="card-view">
      <el-card v-for="item in submits" :key="item.id" class="submit-card">
        <div class="card-header">
          <h3 class="homework-title">{{ item.homeworkTitle }}</h3>
          <el-tag :type="item.isCorrected ? 'success' : 'warning'" size="small">
            {{ item.isCorrected ? '已批改' : '未批改' }}
          </el-tag>
        </div>

        <div class="card-content">
          <div class="info-item">
            <span class="label">课程：</span>
            <span>{{ item.subjectName }}</span>
          </div>
          <div class="info-item" v-if="auth==2">
            <span class="label">学生：</span>
            <span>{{ item.studentName }}</span>
          </div>
          <div class="info-item">
            <span class="label">提交时间：</span>
            <span>{{ item.submitTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">评分：</span>
            <span>{{ item.score ? item.score : '暂无评分' }}</span>
          </div>
        </div>

        <div class="card-footer">
          <el-button type="primary" size="small" @click="viewDetail(item.id)">查看详情</el-button>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import { reqGetSubmitInfoList } from '@/api/activity/submit'
import { mapState } from "vuex";

export default {
  name: 'Submit',
  data() {
    return {
      submits: [], // 作业提交数据
      searchText: '',
      selectedStatus: null,
      isMobile: false
    }
  },
  computed: {
    ...mapState("user", ["accountId", "auth"]),
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    this.fetchSubmits();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    async fetchSubmits() {
      let homeworkTotalInfo = {
        input: this.searchText,
        status: this.selectedStatus,
        teacherId: null,
        studentId: null
      }
      if (this.auth == 0) {
        homeworkTotalInfo.studentId = this.accountId
      }
      if (this.auth == 2) {
        homeworkTotalInfo.teacherId = this.accountId
      }
      try {
        const res = await reqGetSubmitInfoList(homeworkTotalInfo)
        if (res.code === 200) {
          this.submits = res.data.map(submit => ({
            ...submit,
            submitTime: this.formatTimestamp(submit.submitTime)
          }));
        } else {
          this.$message.error('获取提交列表失败');
        }
      } catch (error) {
        this.$message.error('获取提交列表失败');
      }
    },
    viewDetail(id) {
      this.$router.push(`/submit/detail/${id}`);
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
  }
}
</script>

<style scoped>
.submit-page {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  color: #303133;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.search-input {
  width: 25%;
  min-width: 200px;
}

.status-select {
  width: 150px;
}

.search-button {
  width: 100px;
}

/* 移动端样式 */
@media screen and (max-width: 768px) {
  .submit-page {
    padding: 10px;
  }

  .page-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .status-select,
  .search-button {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .card-view {
    margin-top: 20px;
  }

  .submit-card {
    margin-bottom: 15px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
  }

  .homework-title {
    font-size: 16px;
    margin: 0;
    flex: 1;
    margin-right: 10px;
  }

  .card-content {
    margin-bottom: 15px;
  }

  .info-item {
    display: flex;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .info-item .label {
    color: #909399;
    min-width: 80px;
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
    border-top: 1px solid #ebeef5;
  }
}

/* 表格样式优化 */
.table-view {
  margin-top: 20px;
  overflow-x: auto;
}

.el-table {
  margin-bottom: 20px;
}

.el-table ::v-deep th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.el-button + .el-button {
  margin-left: 10px;
}

/* 卡片布局样式 */
.submit-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: all 0.3s;
}

.submit-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}
</style>
