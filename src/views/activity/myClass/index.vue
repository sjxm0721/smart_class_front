<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- 头部搜索和操作区 -->
      <div class="header-section">
        <div class="search-group">
          <div class="school-select">
            <span class="label">学校名称：</span>
            <el-select
              v-model="selectSchool"
              placeholder="请选择"
              :disabled="isDisabled"
              class="select-school"
            >
              <el-option
                v-for="item in schoolArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </div>
          <el-button type="primary" class="add-button" @click="addOrEditClass(null)">
            添加班级<i class="el-icon-plus el-icon--right"></i>
          </el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <!-- PC端表格 -->
        <div v-if="!isMobile" class="pc-table">
          <el-table :data="classPageInfo" border>
            <el-table-column label="班级名" prop="className"></el-table-column>
            <el-table-column label="学生数" prop="studentNum" width="100"></el-table-column>
            <el-table-column label="教师数" prop="teacherNum" width="100"></el-table-column>
            <el-table-column label="已关联教师">
              <template slot-scope="{ row }">
                <el-tooltip
                  v-if="row.teacherList && row.teacherList.length"
                  :content="getTeacherNames(row.teacherList)"
                  placement="top"
                  effect="light"
                >
                  <div class="teacher-names">{{ getTeacherNames(row.teacherList) }}</div>
                </el-tooltip>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column width="300">
              <template slot="header">
                <el-input
                  v-model="input"
                  size="mini"
                  placeholder="输入班级名搜索"
                  @change="changeInput"
                />
              </template>
              <template slot-scope="{ row }">
                <div class="action-buttons">
                  <el-button type="warning" size="mini" @click="addOrEditClass(row)">编辑</el-button>
                  <el-button type="primary" size="mini" @click="showBindTeacherDialog(row)">关联教师</el-button>
                  <el-popconfirm
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除吗？"
                    @onConfirm="deleteClass(row)"
                  >
                    <el-button slot="reference" type="danger" size="mini">删除</el-button>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 移动端卡片列表 -->
        <div v-else class="mobile-cards">
          <div class="search-box">
            <el-input
              v-model="input"
              size="small"
              placeholder="输入班级名搜索"
              @change="changeInput"
            >
              <i slot="prefix" class="el-icon-search"></i>
            </el-input>
          </div>

          <el-card v-for="item in classPageInfo" :key="item.classId" class="class-card">
            <div class="class-info">
              <h3>{{ item.className }}</h3>
              <div class="stats">
                <span>学生数：{{ item.studentNum }}</span>
                <span>教师数：{{ item.teacherNum }}</span>
              </div>
              <div class="teacher-list">
                <span class="label">关联教师：</span>
                <span class="value">{{ getTeacherNames(item.teacherList) || '-' }}</span>
              </div>
              <div class="card-actions">
                <el-button type="warning" size="mini" @click="addOrEditClass(item)">编辑</el-button>
                <el-button type="primary" size="mini" @click="showBindTeacherDialog(item)">关联教师</el-button>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除吗？"
                  @onConfirm="deleteClass(item)"
                >
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popconfirm>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-section">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageParams.currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageParams.pageSize"
          :total="Number(total)"
          :layout="isMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
        >
        </el-pagination>
      </div>

      <!-- 弹窗区域 -->
      <!-- 班级信息弹窗 -->
      <el-dialog
        title="班级信息"
        :visible.sync="dialogFormVisible"
        :width="isMobile ? '90%' : '500px'"
        :show-close="false"
        custom-class="custom-dialog"
      >
        <el-form :model="classInfo" label-position="top">
          <el-form-item label="所属学校">
            <el-select
              v-model="classInfo.schoolId"
              :disabled="isDisabled"
              placeholder="请选择所属学校"
              class="full-width"
            >
              <el-option
                v-for="item in schoolArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称">
            <el-input
              v-model="classInfo.className"
              autocomplete="off"
              class="full-width"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelClick">取 消</el-button>
          <el-button type="primary" @click="confirmClick">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 关联教师弹窗 -->
      <el-dialog
        title="关联教师"
        :visible.sync="bindTeacherDialogVisible"
        :width="isMobile ? '95%' : '700px'"
        :close-on-click-modal="false"
        @closed="handleBindDialogClose"
        custom-class="bind-teacher-dialog"
      >
        <div class="bind-teacher-container">
          <el-transfer
            v-model="selectedTeachers"
            :data="availableTeachers"
            :titles="['待选教师', '已选教师']"
            :props="{
              key: 'accountId',
              label: 'name'
            }"
            :filter-method="filterMethod"
            filter-placeholder="请输入教师姓名"
            filterable
          >
            <template slot-scope="{ option }">
              <div class="transfer-item">
                <span>{{ option.name }}</span>
                <small class="user-id">({{ option.userId }})</small>
              </div>
            </template>
          </el-transfer>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="bindTeacherDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmBindTeachers" :loading="binding">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
import { reqBindTeachers } from '@/api/activity/myClass'
import {reqGetTeacherList} from '@/api/activity/account'

export default {
  name: "MyClass",
  computed: {
    maxPage() {
      return Math.ceil(this.total / this.pageSize) || 1;
    },
    isDisabled() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1";
    },
    ...mapState("school", ["schoolInfoList"]),
    ...mapState("myClass", ["classPageInfo", "total"]),
    schoolArray() {
      const startItem = {
        value: null,
        label: "",
      };
      return [
        startItem,
        ...this.schoolInfoList.map((school) => ({
          value: school.schoolId,
          label: school.schoolName,
        })),
      ];
    },
    // 计算实际总页数
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  data() {
    return {
      pageParams: {
        currentPage: 1,
        pageSize: 5
      },
      input: '',
      isMobile: false,
      total: 0,
      currentPage: 1,
      pageSize: 5,
      selectSchool: null,
      masterName: "",
      dialogFormVisible: false,
      bindTeacherDialogVisible: false,
      currentClassInfo: null,
      availableTeachers: [],
      selectedTeachers: [],
      binding: false,
      classInfo: {
        classId: null,
        schoolId: null,
        className: "",
      },
      loading: false // 添加loading状态
    };
  },
  methods: {
    // 处理页码变化
    handleCurrentChange(val) {
      this.pageParams.currentPage = val;
      this.getClassPageInfo();
    },

    // 处理每页数量变化
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.pageParams.currentPage = 1; // 重置到第一页
      this.getClassPageInfo();
    },
// 获取班级列表数据
    async getClassPageInfo() {
      try {
        const params = {
          schoolId: this.selectSchool || null,  // 确保有值
          input: (this.input || '').trim(),     // 确保有值
          currentPage: this.pageParams.currentPage,
          pageSize: this.pageParams.pageSize
        };

        // 移除值为null或undefined的属性
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const result = await this.$store.dispatch('myClass/getClassPageInfo', params);
        if (result && result.data) {
          this.total = result.data.total;
        }
      } catch (error) {
        this.$message.error('获取班级列表失败');
        console.error(error);
      }
    },
    resetPagination() {
      this.currentPage = 1;
    },


    // 搜索处理
    changeInput() {
      this.pageParams.currentPage = 1; // 搜索时重置到第一页
      this.getClassPageInfo();
    },

    // 选择学校处理
    handleSchoolChange() {
      this.resetPagination();
      this.getClassPageInfo();
    },
    // 显示绑定教师弹窗
    async showBindTeacherDialog(row) {
      this.currentClassInfo = row;
      this.bindTeacherDialogVisible = true;

      try {
        // 获取可用教师列表
        const response = await reqGetTeacherList(
          row.classId
        );

        if (response.code === 200) {
          this.availableTeachers = response.data;
          // 如果已有关联教师，设置为已选
          if (row.teacherList && row.teacherList.length) {
            this.selectedTeachers = row.teacherList.map(teacher => teacher.accountId);
          }
        } else {
          this.$message.error(response.msg || '获取教师列表失败');
        }
      } catch (error) {
        console.error('获取教师列表失败:', error);
        this.$message.error('获取教师列表失败');
      }
    },

    // 关闭弹窗时清理数据
    handleBindDialogClose() {
      this.currentClassInfo = null;
      this.availableTeachers = [];
      this.selectedTeachers = [];
      this.binding = false;
    },

    // 搜索过滤方法
    filterMethod(query, item) {
      return item.name.indexOf(query) > -1 || item.accountId.indexOf(query) > -1;
    },

    // 确认绑定教师
    async confirmBindTeachers() {
      if (!this.currentClassInfo) return;

      this.binding = true;
      try {
        const bindInfo = {
          classId: this.currentClassInfo.classId,
          teacherIds: this.selectedTeachers
        };

        const result = await reqBindTeachers(bindInfo);

        if (result.code === 200) {
          this.$message.success('关联教师成功');
          this.bindTeacherDialogVisible = false;
          this.getClassPageInfo(); // 刷新列表
        } else {
          this.$message.error(result.msg || '关联教师失败');
        }
      } catch (error) {
        console.error('关联教师失败:', error);
        this.$message.error('关联教师失败');
      } finally {
        this.binding = false;
      }
    },
    getTeacherNames(teacherList) {
      if (!teacherList || !teacherList.length) return '-';
      return teacherList.map(teacher => teacher.name).join('、');
    },
    async getSchoolInfoBySchoolId(schoolId) {
      const result = await this.$API.school.reqGetSchoolInfoBySchoolId(
        schoolId
      );
      if (result.code == 200) {
        this.masterName = result.data["masterName"];
      } else return Promise.reject(new Error(result.msg));
    },
    addOrEditClass(row) {
      if (row != null) {
        this.classInfo.classId = row.classId;
        this.classInfo.schoolId = row.schoolId;
        this.classInfo.className = row.className;
      }
      this.dialogFormVisible = true;
    },
    cancelClick() {
      this.dialogFormVisible = false;
      this.classInfo = {
        classId: null,
        schoolId: this.isDisabled==true?this.$store.getters.schoolId:null,
        className: "",
      };
    },
    checkDevice() {
      this.isMobile = window.innerWidth <= 768;
    },
    confirmClick() {
      if (this.classInfo.classId) {
        //更新操作
        this.$store
          .dispatch("myClass/updateClass", this.classInfo)
          .then(() => {
            this.$message({
              type: "success",
              message: "更新班级成功",
            });
            this.getClassPageInfo();
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err,
            });
          });
      } else {
        //添加操作
        this.$store
          .dispatch("myClass/addClass", this.classInfo)
          .then(() => {
            this.$message({
              type: "success",
              message: "新增班级成功",
            });
            this.getClassPageInfo();
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err,
            });
          });
      }
      this.dialogFormVisible = false;
      this.classInfo = {
        classId: null,
        schoolId: this.isDisabled==true?this.$store.getters.schoolId:null,
        className: "",
      };
    },
    deleteClass(row){
      const deleteInfo={
        classId:row.classId,
        schoolId:row.schoolId
      }
      this.$store.dispatch("myClass/deleteClass",deleteInfo)
        .then(()=>{
          this.$message({
            type:'success',
            message:'删除班级成功'
          })
          this.getClassPageInfo();
        })
        .catch((err)=>{
          this.$message({
            type:'error',
            message:err
          })
        })
    },
    clearTeacher(row){
      this.$store.dispatch("myClass/clearTeacher",row.classId)
        .then(()=>{
          this.$message({
            type:'success',
            message:'解绑教师成功'
          })
          this.getClassPageInfo();
        })
        .catch((err)=>{
          this.$message({
            type:'error',
            message:err
          })
        })
    },
  },
  created() {
    if (this.isDisabled) {
      this.classInfo.schoolId = this.$store.getters.schoolId;
    }
  },
  mounted() {
    this.$store.dispatch("school/getSchoolInfoList");

    if (this.isDisabled) {
      this.selectSchool = this.$store.getters.schoolId;
    } else if (localStorage.getItem("schoolId")) {
      this.selectSchool = parseInt(
        crypto.Decrypt(localStorage.getItem("schoolId"))
      );
    }

    // 初始加载数据
    this.getClassPageInfo();

    this.checkDevice();
    window.addEventListener('resize', this.checkDevice);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDevice);
  },
  watch: {
    total: {
      handler(newVal) {
        const maxPage = Math.ceil(newVal / this.pageSize) || 1;
        if (this.currentPage > maxPage) {
          this.currentPage = maxPage;
          this.getClassPageInfo();
        }
      },
      immediate: true
    },
    selectSchool: {
      handler(newValue) {
        this.currentPage = 1;
        this.getClassPageInfo();
      },
      immediate: true
    }
  },
};
</script>

<style scoped>
/* 基础布局 */
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.content-wrapper {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  min-height: calc(100vh - 40px);
}

/* 头部搜索区域 */
.header-section {
  margin-bottom: 20px;
}

.search-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.school-select {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap; /* 防止换行 */
}

.school-select .label {
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
  min-width: fit-content;
}

.select-school {
  width: 200px;
}

/* 搜索框样式 */
.search-box {
  margin-bottom: 15px;
}

.search-box :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  height: 100%;
}

.search-box :deep(.el-input__inner) {
  padding-left: 30px;
}

/* 表格区域 */
.table-section {
  margin: 20px 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.teacher-names {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .page-container {
    padding: 10px;
  }

  .content-wrapper {
    padding: 15px;
  }

  .search-group {
    flex-direction: column;
    align-items: stretch;
  }

  .school-select {
    width: 100%;
    justify-content: flex-start;
  }

  .school-select .label {
    min-width: 70px; /* 保证移动端标签宽度一致 */
  }

  .select-school {
    width: calc(100% - 80px); /* 减去标签宽度和间距 */
  }

  .add-button {
    width: 100%;
  }

  /* 搜索框移动端样式 */
  .search-box .el-input {
    width: 100%;
  }

  /* 卡片样式 */
  .class-card {
    margin-bottom: 15px;
  }

  .class-info h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
  }

  .stats {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
    color: #666;
    font-size: 14px;
  }

  .teacher-list {
    margin: 10px 0;
    font-size: 14px;
  }

  .teacher-list .label {
    color: #666;
  }

  .teacher-list .value {
    word-break: break-all;
  }

  .card-actions {
    display: flex;
    gap: 8px;
    margin-top: 15px;
    flex-wrap: wrap;
  }

  .card-actions .el-button {
    flex: 1;
  }
}

/* 穿梭框样式优化 */
:deep(.el-transfer) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-transfer-panel) {
  width: 300px;
}

:deep(.el-transfer-panel__body) {
  height: 400px;
}

/* 弹窗样式 */
:deep(.custom-dialog) .el-dialog__body {
  padding: 20px;
}

:deep(.bind-teacher-dialog) .el-dialog__body {
  padding: 10px;
}

.bind-teacher-container {
  padding: 10px 0;
}

.transfer-item {
  padding: 5px 0;
}

.user-id {
  color: #909399;
  margin-left: 5px;
}

/* 修复移动端穿梭框样式 */
@media screen and (max-width: 768px) {
  :deep(.el-transfer) {
    flex-direction: column;
    gap: 15px;
  }

  :deep(.el-transfer-panel) {
    width: 100% !important;
    height: 300px;
  }

  :deep(.el-transfer-panel__body) {
    height: 240px !important;
  }

  :deep(.el-transfer__buttons) {
    padding: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
