<template>
  <div class="all">
    <div class="body1">
      <div class="body1-left">
        <span style="margin-left: 20px">学校名称：</span>
        <el-select
          v-model="selectSchool"
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
          v-model="selectClass"
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
      <div class="body1-right">
        <el-button type="info" plain @click="toResult">查看检测结果</el-button>
      </div>
    </div>
    <div class="body2" v-show="selectClass != null">
      <div class="classInc">
        <el-table :data="classInfo" border size="mini">
          <el-table-column prop="teacherName" label="教师姓名">
          </el-table-column>
          <el-table-column prop="phone" label="联系电话"> </el-table-column>
          <el-table-column prop="studentNum" label="学生人数" width="90">
          </el-table-column>
          <el-table-column prop="deviceNum" label="设备个数" width="90">
          </el-table-column>
        </el-table>
      </div>
      <div class="addStudentBtn">
        <div class="btn-on-top">
          <el-popover placement="left" width="500" trigger="click">
            <el-table :data="deviceInfoList">
              <el-table-column
                width="150"
                property="deviceName"
                label="设备名"
              ></el-table-column>
              <el-table-column
                width="90"
                property="testNum"
                label="测试次数"
              ></el-table-column>
              <el-table-column label="设备状态">
                <template slot-scope="{ row, $index }">
                  <el-tag type="success" v-if="row.isFault == 0">正常</el-tag>
                  <el-tag type="danger" v-else>故障</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                property="lastRepairTime"
                label="上次维修时间"
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
        </div>
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
            v-model="studentIdNumber"
          >
          </el-input>
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
<!--          <el-table-column label="性别" width="90">-->
<!--            <template slot-scope="{ row, $index }">-->
<!--              <span v-if="row.studentSex == 0">男</span>-->
<!--              <span v-else>女</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="studentAge" label="年龄" width="90">-->
<!--          </el-table-column>-->
<!--          <el-table-column label="是否近视" width="120">-->
<!--            <template slot-scope="{ row, $index }">-->
<!--              <el-tag type="warning" v-if="row.shortSighted == 1">近视</el-tag>-->
<!--              <el-tag type="success" v-else>未近视</el-tag>-->
<!--            </template>-->
<!--          </el-table-column>-->
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
    ...mapState("school", ["schoolInfoList"]),
    ...mapState("myClass", ["classInfoList", "classInfo"]),
    ...mapState("student", ["studentInfoList"]),
    schoolArray() {
      return this.schoolInfoList.map((school) => ({
        value: school.schoolId,
        label: school.schoolName,
      }));
    },
    classArray() {
      return this.selectSchool == null
        ? []
        : this.classInfoList.map((myClass) => ({
            value: myClass.classId,
            label: myClass.className,
          }));
    },
  },
  data() {
    return {
      selectClass: null,
      selectSchool: null,
      studentInfo: [],
      studentIdNumber: "",
      studentName: "",
      deviceInfoList: [],
      selectItems: [],
    };
  },
  mounted() {
    this.$store.dispatch("school/getSchoolInfoList");
    if (this.isDisabled1 == true && this.isDisabled2 != true) {
      //校管理员
      this.selectSchool = this.$store.getters.schoolId;
      if (localStorage.getItem("classId") != null) {
        this.selectClass = parseInt(
          crypto.Decrypt(localStorage.getItem("classId"))
        );
      }
    } else if (this.isDisabled2 == true) {
      //教师
      this.selectSchool = this.$store.getters.schoolId;
      this.selectClass = this.$store.getters.classId;
    } else {
      //总管理员
      if (localStorage.getItem("schoolId") != null) {
        this.selectSchool = parseInt(
          crypto.Decrypt(localStorage.getItem("schoolId"))
        );
      }
      if (localStorage.getItem("classId") != null) {
        this.selectClass = parseInt(
          crypto.Decrypt(localStorage.getItem("classId"))
        );
      }
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
    getStudentInfoList() {
      let studentTotalInfo = {
        classId: this.selectClass,
        name: this.studentName,
        userId: this.studentIdNumber,
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
    getClassInfoById(classId) {
      this.$store.dispatch("myClass/getClassInfoById", classId).catch((err) => {
        this.$message({
          type: "error",
          message: err,
        });
      });
    },
    addStudent() {
      this.$router.push({
        name: "StudentAdd",
      });
    },
    editStudent(row) {
      this.$router.push({
        name: "StudentAdd",
        params: { studentId: row.studentId },
      });
    },
    deleteStudent(row) {
      this.$store
        .dispatch("student/deleteStudent", row.studentId)
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getStudentInfoList();
          this.getClassInfoById(this.selectClass);
          this.getDeviceInfoListByClassId(this.selectClass);
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
        ids = this.selectItems.map((item) => item.studentId);
        let newIds = ids.join(",");
        this.$store
          .dispatch("student/deleteStudent", newIds)
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getStudentInfoList();
            this.getClassInfoById(this.selectClass);
            this.getDeviceInfoListByClassId(this.selectClass);
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err,
            });
          });
      }
    },
    removeClassLS() {
      this.selectClass = null;
      localStorage.removeItem("classId");
    },
    toResult(){
      this.$router.push("/result");
    }
  },
  watch: {
    selectSchool: {
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
    selectClass: {
      deep: true,
      handler(newValue) {
        if (newValue != null) {
          this.getClassInfoById(newValue);
          localStorage.setItem("classId", crypto.Encrypt(newValue));
          this.getStudentInfoList();
          this.getDeviceInfoListByClassId(this.selectClass).catch(() => {
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
  flex-direction: column;
  justify-content: flex-end;
}

.btn-on-top {
  display: flex;
  justify-content: flex-end;
}

.btn-on-bottom {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.studentInf {
  margin-top: 30px;
}
</style>
