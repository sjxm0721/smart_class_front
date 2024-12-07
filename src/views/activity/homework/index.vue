<template>
  <div class="homework-container">
    <div class="homework-content">
      <!-- 顶部操作栏 -->
      <div class="operation-bar">
        <div class="search-area">
          <el-input
            v-model="homeworkInput"
            placeholder="请输入作业名"
            prefix-icon="el-icon-search"
            clearable
            size="small"
            @change="getHomeWorkInfoList"
            class="search-input"
          />
        </div>
      </div>

      <!-- 移动端表格替代卡片视图 -->
      <div class="mobile-cards" v-if="isMobile">
        <div v-for="item in formattedHomeworkInfoList" :key="item.id" class="mobile-card">
          <div class="card-header">
            <h3>{{ item.title }}</h3>
            <el-tag :type="getCompletionTagType(item.completeSituation)">
              {{ item.completeSituation }}
            </el-tag>
          </div>
          <div class="card-content">
            <div class="info-item">
              <span class="label">教师：</span>
              <span>{{ item.teacherName }}</span>
            </div>
            <div class="info-item">
              <span class="label">班级：</span>
              <span>{{ item.className }}</span>
            </div>
            <div class="info-item">
              <span class="label">课程：</span>
              <span>{{ item.subjectName }}</span>
            </div>
            <div class="info-item">
              <span class="label">发布时间：</span>
              <span>{{ item.sightedTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">截止时间：</span>
              <span>{{ item.completeTime }}</span>
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" size="mini" @click="goToHomeworkDetail(item)">
              详情
            </el-button>
            <el-popconfirm
              v-if="auth==2"
              title="确定删除该作业吗？"
              @onConfirm="deleteHomework(item)"
            >
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                plain
              >
                删除
              </el-button>
            </el-popconfirm>
          </div>
        </div>
      </div>

      <!-- PC端表格视图 -->
      <div class="table-container" v-else>
        <el-table
          :data="formattedHomeworkInfoList"
          style="width: 100%"
          max-height="calc(100vh - 240px)"
          @selection-change="handleSelectionChange"
          border
        >
          <!-- 原有的表格列保持不变 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="detail-form">
                <div class="form-row">
                  <el-form-item label="作业名称">
                    <span>{{ props.row.title }}</span>
                  </el-form-item>
                  <el-form-item label="教师">
                    <span>{{ props.row.teacherName }}</span>
                  </el-form-item>
                  <el-form-item label="班级">
                    <span>{{ props.row.className }}</span>
                  </el-form-item>
                </div>
                <div class="form-row">
                  <el-form-item label="布置时间">
                    <span>{{ props.row.sightedTime }}</span>
                  </el-form-item>
                  <el-form-item label="截止时间">
                    <span>{{ props.row.completeTime }}</span>
                  </el-form-item>
                  <el-form-item label="完成情况">
                    <span>{{ props.row.completeSituation }}</span>
                  </el-form-item>
                </div>
                <div class="form-row">
                  <el-form-item label="未完成名单" class="full-width">
                    <span>{{ props.row.unCompleteStudentList }}</span>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column
            fixed
            prop="title"
            label="作业名称"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="teacherName"
            label="教师"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="className"
            label="班级"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="subjectName"
            label="课程名"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sightedTime"
            label="发布时间"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="completeTime"
            label="截止时间"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="completeSituation"
            label="完成情况"
            min-width="120"
          >
            <template slot-scope="{row}">
              <el-tag :type="getCompletionTagType(row.completeSituation)">
                {{ row.completeSituation }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="{ row }">
              <div class="table-actions">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="goToHomeworkDetail(row)"
                >
                  详情
                </el-button>
                <el-popconfirm
                  title="确定删除该作业吗？"
                  @onConfirm="deleteHomework(row)"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    size="mini"
                    v-if="auth==2"
                    plain
                  >
                    删除
                  </el-button>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { reqDelHomework } from '@/api/activity/homework'

export default {
  name: "HomeWork",
  computed: {
    ...mapState("user", ["accountId", "auth"]),
    ...mapState("homework", ["homeworkInfoList"]),
    formattedHomeworkInfoList() {
      return this.homeworkInfoList.map(item => ({
        ...item,
        sightedTime: this.formatTimestamp(item.sightedTime),
        completeTime: this.formatTimestamp(item.completeTime),
        completeSituation: `${item.curNum} / ${item.totalNum}`
      }));
    },
    isMobile() {
      return window.innerWidth <= 768;
    }
  },
  data() {
    return {
      homeworkInput: "",
      studentName: "",
    };
  },
  mounted() {
    this.getHomeWorkInfoList();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      // 触发响应式更新
      this.$forceUpdate();
    },
    getHomeWorkInfoList() {
      const homeWorkTotalInfo = {
        input: this.homeworkInput,
        studentId: null,
        teacherId: null
      };

      if (this.auth == 2) {
        homeWorkTotalInfo.teacherId = this.accountId;
      }
      if (this.auth == 0) {
        homeWorkTotalInfo.studentId = this.accountId;
      }

      this.$store
        .dispatch("homework/getHomeWorkInfoList", homeWorkTotalInfo)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    handleSelectionChange() {},
    async deleteHomework(row) {
      await reqDelHomework(row.id)
    },
    goToHomeworkDetail(row) {
      this.$router.push(`/homework/detail/${row.id}`);
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
    getCompletionTagType(situation) {
      const [current, total] = situation.split('/').map(num => parseInt(num.trim()));
      const percentage = (current / total) * 100;

      if (percentage === 100) return 'success';
      if (percentage >= 60) return 'warning';
      return 'danger';
    }
  }
};
</script>

<style scoped>
.homework-container {
  padding: 20px;
  height: 100%;
  background-color: #f5f7fa;
}

@media screen and (max-width: 768px) {
  .homework-container {
    padding: 10px;
  }

  .homework-content {
    padding: 10px;
  }

  .search-input {
    width: 100% !important;
  }
}

.homework-content {
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
  width: 100%;
}

.search-input {
  width: 240px;
}

.table-container {
  margin-top: 20px;
}

/* 移动端卡片样式 */
.mobile-cards {
  margin-top: 20px;
}

.mobile-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
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
  margin-right: 8px;
  min-width: 70px;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* PC端表单样式 */
.detail-form {
  padding: 20px;
  background-color: #f8f9fb;
  border-radius: 4px;
}

.form-row {
  display: flex;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

@media screen and (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-row .el-form-item {
    margin-right: 0;
    min-width: 100%;
  }
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-row .el-form-item {
  margin-bottom: 0;
  margin-right: 48px;
  min-width: 280px;
}

.form-row .full-width {
  width: 100%;
  margin-right: 0;
}

.el-form-item ::v-deep .el-form-item__label {
  color: #606266;
  font-weight: 500;
}

.el-button + .el-button {
  margin-left: 8px;
}

.el-tag {
  min-width: 80px;
  text-align: center;
}

.el-table ::v-deep .el-table__expand-icon {
  transform: rotate(0deg);
  margin-right: 10px;
}

.el-table ::v-deep .el-table__expand-icon--expanded {
  transform: rotate(90deg);
}

.el-table ::v-deep .el-table__header th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.table-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.table-actions .el-button {
  margin: 0 !important;
  padding: 7px 12px;
}
</style>
