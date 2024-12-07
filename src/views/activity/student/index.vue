<template>
  <div class="all">
    <div class="body1">
      <div class="form-group">
        <div class="form-item">
          <label>学校名称：</label>
          <el-select
            v-model="selectedSchoolId"
            placeholder="请选择"
            class="full-width-select"
            :disabled="isDisabled1"
            @change="removeClassLS"
          >
            <el-option
              v-for="item in schoolArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </div>

        <div class="form-item">
          <label>班级名称：</label>
          <el-select
            v-model="selectedClassId"
            placeholder="请选择"
            class="full-width-select"
            :disabled="isDisabled2"
          >
            <el-option
              v-for="item in classArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="body2" v-show="selectedClassId != null">
      <div class="search-section">
        <div class="search-inputs">
          <el-input
            placeholder="请输入姓名"
            prefix-icon="el-icon-search"
            size="small"
            class="search-input"
            @change="getStudentInfoList"
            v-model="studentName"
          >
          </el-input>
          <el-input
            placeholder="请输入学号"
            prefix-icon="el-icon-search"
            class="search-input"
            size="small"
            @change="getStudentInfoList"
            v-model="userId"
          >
          </el-input>
        </div>

        <div class="action-buttons">
          <el-popover placement="left" width="150" trigger="click">
            <el-table :data="deviceInfoList">
              <el-table-column width="150" property="deviceName" label="设备名"></el-table-column>
            </el-table>
            <el-button type="success" size="small" slot="reference" class="action-btn">
              查看设备<i class="el-icon-camera el-icon--right"></i>
            </el-button>
          </el-popover>

          <el-button type="primary" @click="addStudent" size="small" class="action-btn">
            添加学生<i class="el-icon-plus el-icon--right"></i>
          </el-button>

          <el-upload
            class="upload-btn"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
            accept=".xlsx,.xls"
          >
            <el-button type="warning" size="small" class="action-btn">
              批量导入<i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>

          <el-button type="info" size="small" class="action-btn" @click="downloadTemplate">
            下载模板<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </div>
      </div>

      <!-- 替换表格为卡片列表 -->
      <div class="student-list">
        <!-- 多选控制条 -->
        <div class="selection-bar" v-if="selectMode">
          <el-checkbox
            :value="isAllSelected"
            @change="toggleAllSelection"
          >全选</el-checkbox>
          <div class="selection-count" v-if="selectItems.length > 0">
            已选择 {{ selectItems.length }} 项
          </div>
        </div>

        <div class="student-cards">
          <div
            v-for="student in studentInfoList"
            :key="student.accountId"
            class="student-card"
            :class="{ 'selected': isSelected(student) }"
            @click="selectMode && toggleSelection(student)"
          >
            <!-- 选择框 -->
            <div class="card-checkbox" v-if="selectMode">
              <el-checkbox
                :value="isSelected(student)"
                @click.stop
                @change="(val) => toggleSelection(student)"
              ></el-checkbox>
            </div>

            <!-- 卡片内容部分 -->
            <div
              class="card-content"
              :class="{ 'with-checkbox': selectMode }"
            >
              <div class="student-main-info">
                <span class="student-name">{{ student.name }}</span>
                <span class="student-id">学号：{{ student.userId }}</span>
              </div>
              <div class="student-detail">
                <div class="info-item">
                  <i class="el-icon-school"></i>
                  <span>{{ student.schoolName }}</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-office-building"></i>
                  <span>{{ student.className }}</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-phone"></i>
                  <span>{{ student.phone }}</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-message"></i>
                  <span>{{ student.email }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="card-actions" v-if="!selectMode">
              <el-button
                type="text"
                @click.stop="editStudent(student)"
                class="edit-btn"
              >修改</el-button>
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="deleteStudent(student)"
              >
                <el-button
                  type="text"
                  slot="reference"
                  class="delete-btn"
                >删除</el-button>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
import { reqStudentExcelImport } from '@/api/activity/student'
import { reqGetAllClassList } from '@/api/activity/myClass'
export default {
  name: "Student",
  computed: {
    isAllSelected() {
      return this.studentInfoList.length > 0 &&
        this.selectItems.length === this.studentInfoList.length;
    },
    isDisabled1() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1";
    },
    isDisabled2() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1" && userAuth !== "2";
    },
    ...mapState("user",["schoolId","accountId"]),
    ...mapState("school", ["schoolInfoList"]),
    ...mapState("student", ["studentInfoList"]),
    // 学校数组
    schoolArray() {
      return this.schoolInfoList.map((school) => ({
        value: school.schoolId.toString(),
        label: school.schoolName,
      }));
    },
    // 班级数组
    classArray() {
      return this.selectedSchoolId == null
        ? []
        : this.classInfoList.map((myClass) => ({
          value: myClass.classId.toString(),
          label: myClass.className,
        }));
    }
  },
  data() {
    return {
      selectedSchoolId: null,  // 改名以更清晰地表示这是ID
      selectedClassId: null,   // 改名以更清晰地表示这是ID
      classInfoList: [],
      studentInfo: [],
      userId: "",
      studentName: "",
      deviceInfoList: [],
      selectItems: [],
      uploadLoading: false,
      selectedMode:false
    };
  },
  async mounted() {
    // 先获取学校列表
    await this.$store.dispatch("school/getSchoolInfoList");

    if (this.isDisabled1 == true && this.isDisabled2 != true) {
      //校管理员
      this.selectedSchoolId = this.$store.getters.schoolId.toString();  // 转为字符串
      // 获取该学校的班级列表
      reqGetAllClassList(this.accountId).then((res)=>{
        if(res.code==200){
          this.classInfoList = res.data
        }
      });

      if (localStorage.getItem("classId") != null) {
        // 确保转换为字符串类型
        this.selectedClassId = crypto.Decrypt(localStorage.getItem("classId")).toString();
        // 获取班级详细信息
        await this.getClassInfoById(this.selectedClassId);
      }
    } else if (this.isDisabled2 == true) {
      //教师
      this.selectedSchoolId = this.$store.getters.schoolId.toString();  // 转为字符串
      // 获取该学校的班级列表
      await this.$store.dispatch("myClass/getClassInfoList", this.selectedSchoolId);

      this.selectedClassId = this.$store.getters.classId.toString();  // 转为字符串
      // 获取班级详细信息
      if (this.selectedClassId) {
        await this.getClassInfoById(this.selectedClassId);
      }
    } else {
      //总管理员
      if (localStorage.getItem("schoolId") != null) {
        this.selectedSchoolId = crypto.Decrypt(localStorage.getItem("schoolId")).toString();  // 转为字符串
        // 获取该学校的班级列表
        await this.$store.dispatch("myClass/getClassInfoList", this.selectedSchoolId);
      }

      if (localStorage.getItem("classId") != null) {
        this.selectedClassId = crypto.Decrypt(localStorage.getItem("classId")).toString();  // 转为字符串
        // 获取班级详细信息
        await this.getClassInfoById(this.selectedClassId);
      }
    }

    // 如果已选择班级，获取学生列表和设备信息
    if (this.selectedClassId) {
      this.getStudentInfoList();
      await this.getDeviceInfoListByClassId(this.selectedClassId).catch(() => {
        this.$message({
          type: "error",
          message: "获取班级设备信息列表失败",
        });
      });
    }
  },
  methods: {
    toggleSelection(student) {
      this.$refs.studentInfoList.toggleRowSelection(student);
    },
    toggleAllSelection(val) {
      if (val) {
        this.$refs.studentInfoList.toggleAll(true);
      } else {
        this.$refs.studentInfoList.clearSelection();
      }
    },
    isSelected(student) {
      return this.selectItems.some(item => item.accountId === student.accountId);
    },
    async getDeviceInfoListByClassId(classId) {
      let result = await this.$API.device.reqGetDeviceInfoListByClassId(
        classId
      );
      if (result.code == 200) {
        this.deviceInfoList = result.data;
        return "ok";
      } else return Promise.reject(new Error(result.msg));
    },
    async getClassInfoById(classId) {
      try {
        await this.$store.dispatch("myClass/getClassInfoById", classId);
      } catch (err) {
        this.$message({
          type: "error",
          message: err,
        });
      }
    },
    addStudent() {
      this.$router.push({
        name: "StudentAdd",
      });
    },
    editStudent(row) {
      this.$router.push({
        name: "StudentAdd",
        params: { accountId: row.accountId },
      });
    },
    deleteStudent(row) {
      this.$store
        .dispatch("student/deleteStudent", row.accountId)
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getStudentInfoList();
          this.getClassInfoById(this.selectedClassId);
          this.getDeviceInfoListByClassId(this.selectedClassId);
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
    },

    getStudentInfoList() {
      let studentTotalInfo = {
        classId: this.selectedClassId,
        name: this.studentName,
        userId: this.userId,
      };
      this.$store
        .dispatch("student/getStudentInfoList", studentTotalInfo)
        .catch((err) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
    },
    // 处理文件上传时使用selectedClassId
    async handleUpload({ file }) {
      try {
        this.uploadLoading = true;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('classId', this.selectedClassId.toString());

        const result = await reqStudentExcelImport(formData);

        if (result.code == 200) {
          this.$message.success('导入成功');
          this.getStudentInfoList();
          this.getClassInfoById(this.selectedClassId);
        } else {
          this.$message.error('导入失败');
        }
      } catch (error) {
        this.$message.error('导入失败');
      } finally {
        this.uploadLoading = false;
      }
    },
    removeClassLS() {
      this.selectedClassId = null;
      localStorage.removeItem("classId");
    },
    // 上传前的校验
    beforeUpload(file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isExcel) {
        this.$message.error('只能上传Excel文件!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 2MB!');
        return false;
      }

      if (!this.selectedClassId) {
        this.$message.error('请先选择班级!');
        return false;
      }

      return true;
    },


    // 下载模板
    downloadTemplate() {
      // 这里替换成实际的模板下载地址
      window.open('https://bilibilipropost.oss-cn-beijing.aliyuncs.com/student.xlsx', '_blank');
    },
  },
  watch: {
    selectedSchoolId: {
      deep: true,
      handler(newValue) {
        if (newValue != null) {
          this.$store
            .dispatch("myClass/getClassInfoList", newValue)
            .catch(() => {
              this.$message({
                type: "error",
                message: "获取班级信息列表失败",
              });
            });
          localStorage.setItem("schoolId", crypto.Encrypt(newValue));
        }
      },
    },
    selectedClassId: {
      deep: true,
      handler(newValue) {
        if (newValue != null) {
          this.getClassInfoById(newValue);
          localStorage.setItem("classId", crypto.Encrypt(newValue));
          this.getStudentInfoList();
          this.getDeviceInfoListByClassId(this.selectedClassId).catch(() => {
            this.$message({
              type: "error",
              message: "获取班级设备信息列表失败",
            });
          });
        }
      },
    },
  },
};
</script>

<style>
/* 基础样式重置 */
.all {
  width: 100%;
  box-sizing: border-box;
}

/* 主体区域样式 */
.body1, .body2 {
  margin: 10px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 表单组样式 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-weight: 500;
}

/* 下拉选择器全宽度 */
.full-width-select {
  width: 100%;
}

/* 搜索区域样式 */
.search-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-input {
  width: 100%;
}

/* 操作按钮组样式 */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  flex: 1;
  min-width: 120px;
  margin: 0 !important;
}

/* 表格操作按钮样式 */
.operation-buttons {
  display: flex;
  gap: 10px;
  justify-content: space-around;
}

/* 表格底部按钮样式 */
.table-footer {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

/* 响应式布局 */
@media screen and (min-width: 768px) {
  .form-group {
    flex-direction: row;
    gap: 20px;
  }

  .form-item {
    flex: 1;
  }

  .search-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .search-inputs {
    flex-direction: row;
    width: auto;
  }

  .search-input {
    width: 200px;
  }

  .action-buttons {
    flex-wrap: nowrap;
  }

  .action-btn {
    flex: none;
  }
}

/* 表格响应式处理 */
@media screen and (max-width: 768px) {
  .el-table {
    width: 100%;
    overflow-x: auto;
  }

  .el-table__body {
    width: 100%;
  }

  /* 调整表格内容在小屏幕上的显示 */
  .el-table .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 上传按钮样式保持不变 */
.upload-btn {
  display: inline-block;
}

.upload-btn .el-upload {
  display: inline-block;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* 为iOS添加弹性滚动 */
}

/* 表格响应式处理 */
@media screen and (max-width: 768px) {
  .table-wrapper {
    margin: 0 -15px; /* 抵消父容器的padding */
    padding: 0 15px;
    width: calc(100% + 30px);
  }

  .el-table {
    width: 990px !important; /* 设置一个固定的最小宽度 */
    table-layout: fixed;
  }

  /* 固定列样式优化 */
  .el-table__fixed,
  .el-table__fixed-right {
    height: 100% !important;
    box-shadow: none;
  }

  /* 调整表格内容在小屏幕上的显示 */
  .el-table .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 5px;
    padding-right: 5px;
  }

  /* 优化固定列的显示 */
  .el-table__fixed-right {
    right: 0;
    box-shadow: -2px 0 8px rgba(0,0,0,.1);
  }

  .el-table__fixed {
    left: 0;
    box-shadow: 2px 0 8px rgba(0,0,0,.1);
  }

  /* 操作按钮组样式优化 */
  .operation-buttons {
    display: flex;
    justify-content: space-around;
    gap: 5px;
    white-space: nowrap;
  }

  /* 表格底部按钮组样式优化 */
  .table-footer {
    margin: 20px 0;
    padding: 0 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .table-footer .el-button {
    flex: 1;
    min-width: 120px;
  }
}

/* 处理表格横向滚动时的样式 */
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto !important;
}

/* 优化表格在移动端的触摸体验 */
.el-table__body-wrapper {
  -webkit-overflow-scrolling: touch;
}

/* 确保固定列的内容不会被截断 */
.el-table__fixed-right-patch {
  background-color: #fff;
}

/* 优化表格边框在移动端的显示 */
.el-table::before,
.el-table::after {
  display: none;
}

/* 学生列表样式 */
.student-list {
  margin-top: 20px;
}

/* 选择控制栏 */
.selection-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 10px;
}

.selection-count {
  color: #606266;
  font-size: 14px;
}

/* 学生卡片样式 */
.student-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.student-card {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  position: relative;
  transition: all 0.3s;
}

.student-card.selected {
  background-color: #f0f7ff;
  border: 1px solid #409EFF;
}

.card-checkbox {
  position: absolute;
  top: 15px;
  left: 15px;
}

.card-content {
  flex: 1;
  padding-left: 0;
}

.card-content.with-checkbox {
  padding-left: 40px;
}


.student-main-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 15px;
}

.student-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.student-id {
  color: #909399;
  font-size: 14px;
}

.student-detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

.info-item i {
  color: #909399;
}

.card-actions {
  display: flex;
  gap: 15px;
  padding-left: 15px;
  border-left: 1px solid #EBEEF5;
  align-items: center;
}

.edit-btn {
  color: #e6a23c;
}

.delete-btn {
  color: #f56c6c;
}

/* 底部操作栏 */
.bottom-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  box-shadow: 0 -2px 12px 0 rgba(0,0,0,0.1);
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .student-detail {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
    padding-left: 10px;
  }

  .bottom-bar {
    padding: 10px 20px;
  }

  .bottom-bar .el-button {
    flex: 1;
  }
}
</style>

