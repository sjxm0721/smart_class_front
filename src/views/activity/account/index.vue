<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- 搜索和操作区域 -->
      <div class="header-section">
        <div class="search-controls">
          <!-- 权限选择 -->
          <div class="search-item">
            <span class="label">账号权限：</span>
            <el-select
              v-model="select"
              placeholder="请选择"
              :disabled="isDisabled"
              @change="toOnePageAndSearch"
              class="select-input"
            >
              <el-option
                v-for="item in auths"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </div>

          <!-- 账号搜索 -->
          <div class="search-item">
            <span class="label">账号名称：</span>
            <el-input
              v-model="input"
              placeholder="请输入账号名称"
              class="search-input"
            ></el-input>
          </div>

          <!-- 搜索按钮 -->
          <el-button
            type="info"
            icon="el-icon-search"
            class="search-button"
            @click="searchAccount"
          >搜索</el-button>
        </div>

        <!-- 操作按钮组 -->
        <div class="action-buttons">
          <el-button type="primary" @click="addAccount(null)" class="action-button">
            单个添加<i class="el-icon-plus el-icon--right"></i>
          </el-button>
          <teacher-bulk-import @import-success="getAccountPageInfo" class="action-button" />
        </div>
      </div>

      <!-- 数据展示区域 -->
      <div class="data-section">
        <!-- PC端表格视图 -->
        <div v-if="!isMobile" class="table-view">
          <el-table :data="accountInfo" border style="width: 100%">
            <el-table-column prop="name" label="账号名称" min-width="120"></el-table-column>
            <el-table-column prop="userId" label="用户ID" min-width="120"></el-table-column>
            <el-table-column label="头像" width="100">
              <template slot-scope="{ row }">
                <img :src="row.avatar" alt="没有头像" class="avatar-img" />
              </template>
            </el-table-column>
            <el-table-column prop="authValue" label="账号权限" min-width="100"></el-table-column>
            <el-table-column label="账号状态" min-width="100">
              <template slot-scope="{ row }">
                <el-tag type="success" v-if="row.status == 1">启用中</el-tag>
                <el-tag type="danger" v-else>停用中</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="schoolName" label="所属学校" min-width="120"></el-table-column>
            <el-table-column prop="className" label="所属班级" min-width="120"></el-table-column>
            <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="200">
              <template slot-scope="{ row }">
                <div class="table-actions">
                  <el-button type="warning" size="mini" @click="addAccount(row)">编辑</el-button>
                  <el-button
                    :type="row.status == 0 ? 'success' : 'info'"
                    size="mini"
                    @click="updateStatus(row.userId)"
                  >
                    {{ row.status == 0 ? '启用' : '停用' }}
                  </el-button>
                  <el-popconfirm
                    title="确定删除吗？"
                    @onConfirm="deleteAccount(row)"
                  >
                    <el-button slot="reference" type="danger" size="mini">删除</el-button>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 移动端卡片视图 -->
        <div v-else class="card-view">
          <el-card v-for="item in accountInfo" :key="item.userId" class="account-card">
            <div class="card-header">
              <img :src="item.avatar" alt="没有头像" class="avatar-img" />
              <div class="basic-info">
                <h3>{{ item.name }}</h3>
                <p class="user-id">ID: {{ item.userId }}</p>
              </div>
              <el-tag
                :type="item.status == 1 ? 'success' : 'danger'"
                size="mini"
              >
                {{ item.status == 1 ? '启用中' : '停用中' }}
              </el-tag>
            </div>

            <div class="card-content">
              <div class="info-item">
                <span class="label">账号权限：</span>
                <span>{{ item.authValue }}</span>
              </div>
              <div class="info-item">
                <span class="label">所属学校：</span>
                <span>{{ item.schoolName }}</span>
              </div>
              <div class="info-item">
                <span class="label">所属班级：</span>
                <span>{{ item.className }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机号：</span>
                <span>{{ item.phone }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮箱：</span>
                <span>{{ item.email }}</span>
              </div>
            </div>

            <div class="card-actions">
              <el-button type="warning" size="mini" @click="addAccount(item)">编辑</el-button>
              <el-button
                :type="item.status == 0 ? 'success' : 'info'"
                size="mini"
                @click="updateStatus(item.userId)"
              >
                {{ item.status == 0 ? '启用' : '停用' }}
              </el-button>
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="deleteAccount(item)"
              >
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
              </el-popconfirm>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-section">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          :layout="isMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
          :total="total || 0"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import TeacherBulkImport from './add/TeacherBulkImport.vue';
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
export default {
  name: "Account",
  components: { TeacherBulkImport },
  computed: {
    TeacherBulkImport,
    isDisabled() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1";
    },
    ...mapState("account", ["total", "accountInfo"]),
    ...mapState("user", ["name", "schoolId"]),
  },
  data() {
    return {
      isMobile: false,
      auths: [
        {
          value: null,
          label: "",
        },
        {
          value: 0,
          label: "学生",
        },
        {
          value: 1,
          label: "管理员",
        },
        {
          value: 2,
          label: "教师",
        },
      ],
      select: this.isDisabled == true ? { value: 2, label: "教师" } : null,
      currentPage: 1, //当前页数
      pageSize: 5, //每页展示数据数
      input: "", //搜索条件
    };
  },
  mounted() {
    if (this.isDisabled == true) {
      this.select = 2;
    }
    this.getAccountPageInfo();
    this.checkDevice();
    window.addEventListener('resize', this.checkDevice);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDevice);
  },
  methods: {
    checkDevice() {
      this.isMobile = window.innerWidth <= 768;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccountPageInfo();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccountPageInfo();
    },
    getAccountPageInfo() {
      let pageInfo = {
        auth: this.select,
        input: this.input,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        schoolId: this.schoolId,
      };
      this.$store
        .dispatch("account/getAccountPageInfo", pageInfo)
        .catch((err) => {
          this.$message({
            message: "获取账号信息失败",
            type: "error",
          });
        });
    },
    searchAccount() {
      this.toOnePageAndSearch();
    },
    updateStatus(userId) {
      this.$store
        .dispatch("account/updateAccountStatus", userId)
        .then(() => {
          this.getAccountPageInfo();
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: "error",
          });
        });
    },
    addAccount(row) {
      if (row == null) {
        //添加
        this.$router.push({
          name: "AccountAdd",
        });
      } else {
        if (row.auth == 1) {
          this.$message({
            type: "error",
            message: "没有权限",
          });
        } else {
          this.$router.push({
            name: "AccountAdd",
            params: { userId: row.userId },
          });
        }
      }
    },
    toOnePageAndSearch() {
      this.currentPage = 1;
      this.getAccountPageInfo();
    },
    deleteAccount(row){
      this.$store.dispatch('account/deleteAccount',row.accountId)
      .then(()=>{
        this.$message({
          type:'success',
          message:'删除账号成功'
        })
        this.getAccountPageInfo();
      })
      .catch((err)=>{
        this.$message({
          type:'error',
          message:err
        })
      })
    }
  },
};
</script>

<style scoped>
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
}

/* 搜索区域样式 */
.header-section {
  margin-bottom: 20px;
}

.search-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  white-space: nowrap;
  color: #606266;
}

.select-input,
.search-input {
  width: 150px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 表格样式 */
.table-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

/* 卡片视图样式 */
.account-card {
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.basic-info {
  flex: 1;
}

.basic-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.user-id {
  margin: 0;
  color: #909399;
  font-size: 13px;
}

.card-content {
  margin-bottom: 15px;
}

.info-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item .label {
  color: #909399;
  margin-right: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .page-container {
    padding: 10px;
  }

  .content-wrapper {
    padding: 15px;
  }

  .search-controls {
    flex-direction: column;
  }

  .search-item {
    width: 100%;
  }

  .select-input,
  .search-input {
    flex: 1;
  }

  .search-button {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }

  .card-actions {
    justify-content: space-between;
  }

  .card-actions .el-button {
    flex: 1;
  }

  /* 优化分页器在移动端的显示 */
  .pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
