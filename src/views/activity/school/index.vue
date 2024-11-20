<template>
  <div class="border">
    <div class="header-all">
      <div class="header-left">
        <span style="margin-left: 20px">学校名称：</span>
        <el-input v-model="input" placeholder="请输入学校名称"></el-input>
        <el-button
          type="info"
          icon="el-icon-search"
          style="margin-left: 20px"
          @click="searchSchool"
          >搜索</el-button
        >
      </div>
      <div class="header-right">
        <el-button type="primary" @click="addSchool(null)"
          >新增学校<i class="el-icon-plus el-icon--right"></i
        ></el-button>
      </div>
    </div>
    <div class="body-all">
      <el-table :data="schoolInfo" border style="width: 100%">
        <el-table-column fixed prop="schoolName" label="学校名" width="150">
        </el-table-column>
        <el-table-column label="图片" width="120">
          <template slot-scope="{ row, $index }">
            <img :src="row.pic" alt="没有图片" />
          </template>
        </el-table-column>
        <el-table-column label="负责人" width="150">
          <template slot-scope="{ row, $index }">
            <el-popover trigger="hover" placement="top" v-if="row.masterId">
              <p>姓名: {{ row.masterName }}</p>
              <p>电话: {{ row.phone }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ row.masterName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="classNum" label="班级数" width="120">
        </el-table-column>
        <el-table-column prop="deviceNum" label="设备数" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="300">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <el-button type="warning" size="mini" @click="addSchool(row)"
              >编辑</el-button
            >
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @onConfirm="deleteSchool(row)"
            >
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;"
                >删除</el-button
              >
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
import { mapState } from "vuex";
export default {
  name: "School",
  data() {
    return {
      input: "", //查询输入框的内容
      currentPage: 1, //当前页数
      pageSize: 5, //每页展示数据数
    };
  },
  computed: {
    ...mapState("school", ["total", "schoolInfo"]),
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getSchoolInfo();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSchoolInfo();
    },
    //发送请求查询school数据
    getSchoolInfo() {
      let pageInfo = {
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        input:this.input,
      };
      this.$store.dispatch("school/getSchoolInfo", pageInfo)
      .catch((err)=>{
        this.$message({
          message:'获取学校信息失败',
          type:'error'
        })
      })
    },
    searchSchool() {
      this.currentPage=1;
      this.getSchoolInfo();
    },
    addSchool(row) {
      if (row != null) {
        this.$router.push({
          name: "SchoolAdd",
          params: { schoolId: row.schoolId },
        });
      } else {
        this.$router.push({
          name: "SchoolAdd",
        });
      }
    },
    deleteSchool(row) {
      this.$store
        .dispatch("school/deleteSchool", row.schoolId)
        .then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getSchoolInfo();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: err,
            type: "error",
          });
        });
    },
  },
  mounted() {
    this.getSchoolInfo();
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

.header-right {
  float: right;
}

.body-all {
  margin: 10px;
  margin-top: 30px;
}

.bottom-all {
  display: flex;
  justify-content: center;
}
</style>
