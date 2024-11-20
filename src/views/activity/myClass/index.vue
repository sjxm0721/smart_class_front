<template>
  <div>
    <div class="border">
      <div class="header-all">
        <div class="header-left">
          <span style="margin-left: 20px">学校名称：</span>
          <el-select
            v-model="selectSchool"
            placeholder="请选择"
            style="width: 200px"
            :disabled="isDisabled"
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
          <span style="margin-left: 20px">校管理员：</span>
          <el-input v-model="masterName" :disabled="true" style="width: 150px">
          </el-input>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="addOrEditClass(null)"
            >添加班级<i class="el-icon-plus el-icon--right"></i
          ></el-button>
        </div>
      </div>
      <div class="body-all">
        <el-table :data="classPageInfo">
          <el-table-column label="班级名" prop="className"> </el-table-column>
          <el-table-column label="教师" width="150">
            <template slot-scope="{ row, $index }">
              <el-popover trigger="hover" placement="top" v-if="row.teacherId">
                <p>姓名: {{ row.teacherName }}</p>
                <p>电话: {{ row.phone }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ row.teacherName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="学生数" prop="studentNum"> </el-table-column>
          <el-table-column label="设备数" prop="deviceNum"> </el-table-column>
          <el-table-column label="上次修改时间" prop="updateTime">
          </el-table-column>
          <el-table-column width="250">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="input"
                size="mini"
                placeholder="输入班级名搜索"
                @change="changeInput"
              />
            </template>
            <template slot-scope="{ row, $index }">
              <el-button type="warning" size="mini" @click="addOrEditClass(row)"
                >编辑</el-button
              >
              <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定解绑吗？"
              v-show="row.teacherId!=null"
              @onConfirm="clearTeacher(row)"
            >
            <el-button type="info" size="mini" slot="reference" style="margin-left: 10px;"
                >解绑教师</el-button
              >
            </el-popconfirm>
              <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @onConfirm="deleteClass(row)"
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
      <div class="dialog">
        <el-dialog
          title="班级信息"
          :visible.sync="dialogFormVisible"
          :show-close="false"
        >
          <el-form :model="classInfo">
            <el-form-item label="所属学校">
              <el-select
                v-model="classInfo.schoolId"
                :disabled="isDisabled"
                placeholder="请选择所属学校"
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
            </el-form-item>
            <el-form-item label="班级名称">
              <el-input
                v-model="classInfo.className"
                autocomplete="off"
                style="width: 250px"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelClick">取 消</el-button>
            <el-button type="primary" @click="confirmClick">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
export default {
  name: "MyClass",
  computed: {
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
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 5, //每页展示数据数
      input: "", //用户查询内容
      selectSchool: null,
      masterName: "",
      dialogFormVisible: false, //控制dialog的显示与隐藏
      classInfo: {
        classId: null,
        schoolId: null,
        className: "",
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getClassPageInfo();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getClassPageInfo();
    },
    async getSchoolInfoBySchoolId(schoolId) {
      const result = await this.$API.school.reqGetSchoolInfoBySchoolId(
        schoolId
      );
      if (result.code == 200) {
        this.masterName = result.data["masterName"];
      } else return Promise.reject(new Error(result.msg));
    },
    getClassPageInfo() {
      const pageInfo = {
        schoolId: this.selectSchool,
        input: this.input,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      this.$store
        .dispatch("myClass/getClassPageInfo", pageInfo)
        .catch((err) => {
          this.$message({
            type: "error",
            message: "获取班级列表数据失败",
          });
        });
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
    changeInput(){
      this.currentPage=1;
      this.getClassPageInfo();
    }
  },
  created(){
    if(this.isDisabled){
      this.classInfo.schoolId=this.$store.getters.schoolId;
    }
  },
  mounted() {
    this.$store.dispatch("school/getSchoolInfoList");
    if (this.isDisabled == true) {
      this.selectSchool = this.$store.getters.schoolId;
    }
    else{
      if (localStorage.getItem("schoolId") != null) {
        this.selectSchool = parseInt(
          crypto.Decrypt(localStorage.getItem("schoolId"))
        );
      }
    }
    this.getClassPageInfo();
  },
  watch: {
    selectSchool: {
      handler(newValue) {
        if (newValue != null) {
          this.getSchoolInfoBySchoolId(newValue).catch(() => {
            this.$message({
              message: "获取校管理员信息失败",
              type: "error",
            });
            this.masterName="";
          });
        } else {
          this.masterName = "";
        }
        this.currentPage=1;
        this.getClassPageInfo();
      },
    },
  },
};
</script>

<style scoped>
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
