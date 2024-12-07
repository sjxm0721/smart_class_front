<template>
  <div class="page-container">
    <div class="border">
      <!-- 搜索和操作区域 -->
      <div class="header-all">
        <div class="header-wrapper">
          <div class="header-left">
            <span class="search-label">学校名称：</span>
            <div class="input-wrapper">
              <el-input v-model="input" placeholder="请输入学校名称"></el-input>
            </div>
            <el-button
              type="info"
              icon="el-icon-search"
              class="search-button"
              @click="searchSchool"
            >搜索
            </el-button>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="addSchool(null)">
              新增学校<i class="el-icon-plus el-icon--right"></i>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="body-all">
        <!-- PC端表格 -->
        <div class="pc-table" v-show="!isMobile">
          <el-table :data="schoolInfo" border style="width: 100%">
            <el-table-column fixed prop="schoolName" label="学校名" width="150">
            </el-table-column>
            <el-table-column label="图片" width="120">
              <template slot-scope="{ row }">
                <img :src="row.pic" alt="没有图片" class="school-image"/>
              </template>
            </el-table-column>
            <el-table-column prop="classNum" label="班级数" width="120">
            </el-table-column>
            <el-table-column prop="teacherNum" label="教师数" width="120">
            </el-table-column>
            <el-table-column prop="studentNum" label="学生数" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址" width="300">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="{ row }">
                <el-button type="warning" size="mini" @click="addSchool(row)">
                  编辑
                </el-button>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除吗？"
                  @onConfirm="deleteSchool(row)"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    size="mini"
                    class="delete-button"
                  >删除
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 移动端卡片列表 -->
        <div class="mobile-cards" v-show="isMobile">
          <el-card v-for="item in schoolInfo" :key="item.schoolId" class="school-card">
            <div class="school-card-header">
              <img :src="item.pic" alt="没有图片" class="school-image"/>
              <h3>{{ item.schoolName }}</h3>
            </div>
            <div class="school-card-content">
              <p><span class="label">班级数：</span>{{ item.classNum }}</p>
              <p><span class="label">教师数：</span>{{ item.teacherNum }}</p>
              <p><span class="label">学生数：</span>{{ item.studentNum }}</p>
              <p><span class="label">地址：</span>{{ item.address }}</p>
            </div>
            <div class="school-card-actions">
              <el-button type="warning" size="mini" @click="addSchool(item)">
                编辑
              </el-button>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @onConfirm="deleteSchool(item)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  class="delete-button"
                >删除
                </el-button>
              </el-popconfirm>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 分页区域 -->
      <div class="bottom-all">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          :layout="paginationLayout"
          :total="total || 0"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'School',
  data() {
    return {
      input: '',
      currentPage: 1,
      pageSize: 5,
      isMobile: false
    }
  },
  computed: {
    ...mapState('school', ['total', 'schoolInfo']),
    paginationLayout() {
      return this.isMobile
        ? 'prev, pager, next'
        : 'total, sizes, prev, pager, next, jumper'
    }
  },
  methods: {
    checkDevice() {
      this.isMobile = window.innerWidth <= 768
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSchoolInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSchoolInfo()
    },
    getSchoolInfo() {
      const pageInfo = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        input: this.input
      }
      this.$store.dispatch('school/getSchoolInfo', pageInfo)
        .catch(() => {
          this.$message({
            message: '获取学校信息失败',
            type: 'error'
          })
        })
    },
    searchSchool() {
      this.currentPage = 1
      this.getSchoolInfo()
    },
    addSchool(row) {
      if (row != null) {
        this.$router.push({
          name: 'SchoolAdd',
          params: { schoolId: row.schoolId }
        })
      } else {
        this.$router.push({
          name: 'SchoolAdd'
        })
      }
    },
    deleteSchool(row) {
      this.$store
        .dispatch('school/deleteSchool', row.schoolId)
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getSchoolInfo()
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
    }
  },
  mounted() {
    this.checkDevice()
    window.addEventListener('resize', this.checkDevice)
    this.getSchoolInfo()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDevice)
  }
}
</script>

<style scoped>
/* 新增容器样式确保页面可滚动 */
.page-container {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.border {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  min-height: min-content;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
}

.search-label {
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
}

.input-wrapper {
  width: 200px; /* 固定输入框宽度 */
  flex-shrink: 0; /* 防止输入框被压缩 */
}

.search-button {
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.header-right {
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.body-all {
  margin: 20px 0;
  overflow-x: auto; /* 允许表格横向滚动 */
}

.school-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.delete-button {
  margin-left: 10px;
}

/* 移动端样式优化 */
@media screen and (max-width: 768px) {
  .page-container {
    padding: 10px;
  }

  .border {
    padding: 15px;
  }

  .header-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .input-wrapper {
    width: 40%; /* 移动端下输入框宽度自适应 */
    min-width: 120px; /* 最小宽度 */
  }

  .header-right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .school-card {
    margin-bottom: 15px;
  }

  .bottom-all {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  /* 调整分页器在移动端的样式 */
  :deep(.el-pagination) {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
  }
}

/* 确保内容始终可见 */
@media screen and (max-height: 600px) {
  .page-container {
    height: auto;
    min-height: 100vh;
  }
}
</style>
