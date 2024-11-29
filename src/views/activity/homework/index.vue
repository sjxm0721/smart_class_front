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
        <div class="action-area">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addHomeWork"
          >
            布置作业
          </el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          :data="formattedHomeworkInfoList"
          style="width: 100%"
          max-height="calc(100vh - 240px)"
          @selection-change="handleSelectionChange"
          border
        >
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
            min-width="180"
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
            width="280"
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
                <el-button
                  type="warning"
                  size="mini"
                  plain
                  @click="editHomework(row)"
                >
                  修改
                </el-button>
                <el-popconfirm
                  title="确定删除该作业吗？"
                  @onConfirm="deleteHomework(row)"
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
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
  },
  methods: {
    addHomeWork() {
      this.$router.push("/homework/add");
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
    editHomework(row) {},
    deleteHomework(row) {},
    toggleSelected() {},
    deleteSelected() {},
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
}

.search-input {
  width: 240px;
}

.table-container {
  margin-top: 20px;
}

/* 展开行表单样式 */
.detail-form {
  padding: 20px;
  background-color: #f8f9fb;
  border-radius: 4px;
}

.form-row {
  display: flex;
  margin-bottom: 15px;
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

/* 表格内按钮间距 */
.el-button + .el-button {
  margin-left: 8px;
}

/* 完成情况标签样式 */
.el-tag {
  min-width: 80px;
  text-align: center;
}

/* 表格展开图标样式优化 */
.el-table ::v-deep .el-table__expand-icon {
  transform: rotate(0deg);
  margin-right: 10px;
}

.el-table ::v-deep .el-table__expand-icon--expanded {
  transform: rotate(90deg);
}

/* 表头样式优化 */
.el-table ::v-deep .el-table__header th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.table-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;  /* 使用 gap 属性设置按钮间距 */
}

.table-actions .el-button {
  margin: 0 !important;  /* 覆盖 Element UI 的默认 margin */
  padding: 7px 12px;
}
</style>
