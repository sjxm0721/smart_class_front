<template>
  <div class="border">
    <div class="header-all">
      <div class="header-left">
        <span style="margin-left: 20px">账号权限：</span>
        <el-select
          v-model="select"
          placeholder="请选择"
          style="width: 150px"
          :disabled="isDisabled"
          @change="toOnePageAndSearch"
        >
          <el-option
            v-for="item in auths"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>
        <span style="margin-left: 20px">账号名称：</span>
        <el-input
          v-model="input"
          placeholder="请输入账号名称"
          style="width: 150px"
        ></el-input>
        <el-button
          type="info"
          icon="el-icon-search"
          style="margin-left: 20px"
          @click="searchAccount"
          >搜索</el-button
        >
      </div>
      <div class="header-right">
        <div class="button-group">
          <el-button type="primary" @click="addAccount(null)">
            单个添加<i class="el-icon-plus el-icon--right"></i>
          </el-button>
          <teacher-bulk-import @import-success="getAccountPageInfo" />
        </div>
      </div>
    </div>
    <div class="body-all">
      <el-table :data="accountInfo" border style="width: 100%">
        <el-table-column fixed prop="name" label="账号名称" width="150">
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="150">
        </el-table-column>
        <el-table-column label="头像" width="120">
          <template slot-scope="{ row, $index }">
            <img :src="row.avatar" alt="没有头像" />
          </template>
        </el-table-column>
        <el-table-column prop="authValue" label="账号权限" width="120">
        </el-table-column>
        <el-table-column label="账号状态" width="120">
          <template slot-scope="{ row, $index }">
            <el-tag type="success" v-if="row.status == 1">启用中</el-tag>
            <el-tag type="danger" v-else>停用中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="schoolName" label="所属学校" width="120">
        </el-table-column>
        <el-table-column prop="className" label="所属班级" width="120">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="210">
          <template slot-scope="{ row, $index }">
            <el-button type="warning" size="mini" @click="addAccount(row)"
              >编辑</el-button
            >
            <el-button
              type="success"
              size="mini"
              v-if="row.status == 0"
              @click="updateStatus(row.userId)"
              >启用</el-button
            >
            <el-button
              v-else
              type="info"
              size="mini"
              @click="updateStatus(row.userId)"
              >停用</el-button
            >
            <el-popconfirm title="确定删除吗？" @onConfirm="deleteAccount(row)" style="margin-left: 10px;">
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom-all">
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next,jumper"
          :total="total == '' ? 0 : total"
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
  },
  methods: {
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
img {
  width: 50px;
  height: 50px;
}

.border {
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
}

.header-all {
  margin: 10px;
}

.header-all::before,
.header-all::after {
  content: "";
  display: table;
}

.header-all::after {
  clear: both;
}

.header-left {
  float: left;
  display: flex;
  align-items: center;
  white-space: nowrap;
}



.body-all {
  margin: 10px;
  margin-top: 30px;
}

.bottom-all {
  display: flex;
  justify-content: center;
}

.header-right {
  float: right;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 10px; /* 按钮之间的间距 */
}

/* 确保按钮在同一行且垂直居中 */
.button-group :deep(.import-button) {
  display: inline-flex;
  align-items: center;
}
</style>
