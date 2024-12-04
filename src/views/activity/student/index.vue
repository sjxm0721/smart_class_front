<template>
  <div class="all">
    <div class="body1">
      <div class="body1-left">
        <span style="margin-left: 20px">学校名称：</span>
        <el-select
          v-model="selectedSchoolId"
          placeholder="请选择"
          style="width: 200px"
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

        <span style="margin-left: 20px">班级名称：</span>
        <el-select
          v-model="selectedClassId"
          placeholder="请选择"
          style="width: 200px"
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
    <div class="body2" v-show="selectedClassId != null">
      <div class="addStudentBtn">
        <div class="btn-on-bottom">
          <el-input
            placeholder="请输入姓名"
            prefix-icon="el-icon-search"
            size="small"
            style="width: 150px"
            @change="getStudentInfoList"
            v-model="studentName"
          >
          </el-input>
          <el-input
            placeholder="请输入学号"
            prefix-icon="el-icon-search"
            style="width: 150px; margin-left: 10px"
            size="small"
            @change="getStudentInfoList"
            v-model="userId"
          >
          </el-input>
        </div>
        <div class="btn-on-top">
          <el-popover placement="left" width="150" trigger="click">
            <el-table :data="deviceInfoList">
              <el-table-column
                width="150"
                property="deviceName"
                label="设备名"
              ></el-table-column>
            </el-table>
            <el-button type="success" size="small" slot="reference"
            >查看设备<i class="el-icon-camera el-icon--right"></i
            ></el-button>
          </el-popover>
          <el-button
            type="primary"
            @click="addStudent"
            size="small"
            style="margin-left: 10px"
          >添加学生<i class="el-icon-plus el-icon--right"></i
          ></el-button>

          <el-upload
            class="upload-btn"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
            accept=".xlsx,.xls"
          >
            <el-button type="warning" size="small" style="margin-left: 10px">
              批量导入<i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>

          <el-button type="info" size="small" style="margin-left: 10px" @click="downloadTemplate">
            下载模板<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </div>
      </div>
      <div class="studentInf">
        <el-table
          :data="studentInfoList"
          style="width: 100%"
          max-height="500"
          height="500"
          ref="studentInfoList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column fixed prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="userId" label="学号" width="120">
          </el-table-column>
          <el-table-column prop="schoolName" label="学校" width="120">
          </el-table-column>
          <el-table-column prop="className" label="班级" width="120">
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="{ row, $index }">
              <el-button
                @click.native.prevent="editStudent(row)"
                type="text"
                size="small"
                style="color: orange"
              >
                修改
              </el-button>
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="deleteStudent(row)"
              >
                <el-button
                  type="text"
                  size="small"
                  style="color: red; margin-left: 20px"
                  slot="reference"
                >
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="toggleSelected()">取消选择</el-button>
          <el-button @click="deleteSelected" type="danger"
            >删除选择项</el-button
          >
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
    },
    // 当前选中的学校名称
    selectedSchoolName() {
      const school = this.schoolInfoList.find(s => s.schoolId === this.selectedSchoolId);
      return school ? school.schoolName : '';
    },
    // 当前选中的班级名称
    selectedClassName() {
      const classInfo = this.classInfoList.find(c => c.classId === this.selectedClassId);
      return classInfo ? classInfo.className : '';
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
    toggleSelected(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.studentInfoList.toggleRowSelection(row);
        });
      } else {
        this.$refs.studentInfoList.clearSelection();
      }
    },
    handleSelectionChange(selectItems) {
      this.selectItems = selectItems;
    },
    deleteSelected() {
      if (this.selectItems.length == 0) {
        this.$message({
          type: "error",
          message: "选择项不能为空",
        });
      } else {
        let ids = [];
        ids = this.selectItems.map((item) => item.accountId);
        let newIds = ids.join(",");
        this.$store
          .dispatch("student/deleteStudent", newIds)
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
      }
    },
    toResult(){
      this.$router.push("/result");
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
.body1 {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.body1::before,
.body1::after{
  content:'';
  display: table;
}

.body1::after{
  clear:both;
}

.body1-left{
  float: left;
}

.body1-right{
  float: right;
}

.body2 {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.body2::before,
.body2::after {
  content: "";
  display: table;
}

.body2::after {
  clear: both;
}

.classInc {
  float: left;
  width: 60%;
}

.addStudentBtn {
  display: flex;
  //flex-direction: column;
  justify-content: space-between;
}

.btn-on-top {
  display: flex;
  justify-content: flex-end;
}

.btn-on-bottom {
}

.studentInf {
  margin-top: 30px;
}

.upload-btn {
  display: inline-block;
}

.upload-btn .el-upload {
  display: inline-block;
}

/* 为了保持按钮组的对齐 */
.btn-on-top {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.btn-on-top .el-button {
  margin-bottom: 0;
}

</style>
