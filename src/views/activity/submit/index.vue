<template>
  <div class="submit-page">
    <h2>学生作业提交</h2>

    <!-- 搜索和筛选条件 -->
    <div class="filters">
      <el-input v-model="searchText" placeholder="搜索作业内容" clearable class="search-input"></el-input>
      <el-select v-model="selectedStatus" placeholder="选择批改状态" class="status-select">
        <el-option label="全部状态" value=""></el-option>
        <el-option label="未批改" value="0"></el-option>
        <el-option label="已批改" value="1"></el-option>
      </el-select>
      <el-button type="primary" @click="fetchSubmits" class="search-button">搜索</el-button>
    </div>

    <!-- 作业提交列表 -->
    <el-table :data="submits" style="width: 100%">
      <el-table-column prop="homeworkTitle" label="作业标题"></el-table-column>
      <el-table-column prop="subjectName" label="课程"></el-table-column>
      <el-table-column prop="studentName" v-if="auth==2" label="学生姓名"></el-table-column>
      <el-table-column prop="submitTime" label="提交时间"></el-table-column>
      <el-table-column label="批改状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isCorrected ? 'success' : 'warning'">
            {{ scope.row.isCorrected ? '已批改' : '未批改' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评分">
        <template slot-scope="scope">
          {{ scope.row.score ? scope.row.score : '暂无评分' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

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
    }
  },
  computed: {
    ...mapState("user", ["accountId", "auth"]),
  },
  mounted() {
    this.fetchSubmits();
  },
  methods: {
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
      if (this.auth == 2 ) {
        homeworkTotalInfo.teacherId = this.accountId
      }
      reqGetSubmitInfoList(homeworkTotalInfo).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.submits = res.data
          this.submits.forEach(submit => {
            submit.submitTime = this.formatTimestamp(submit.submitTime)
            return submit
          })
        } else {

        }
      }).catch(error => {

      })
    },
    viewDetail(id) {
      // 跳转到作业提交详情页
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
  },
  created() {
    this.fetchSubmits();
  }
}
</script>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 25%;
  margin-right: 10px;
}

.status-select {
  width: 150px;
  margin-right: 10px;
}

.search-button {
  width: 100px;
}
</style>
