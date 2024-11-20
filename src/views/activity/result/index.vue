<template>
  <div class="border">
    <div class="top">
      <div class="top-left">
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
      <div class="top-right">
        <el-input
          placeholder="请输入内容"
          v-model="input"
          class="input-with-select"
          style="width: 250px"
        >
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="结果ID" value="1"></el-option>
            <el-option label="学生姓名" value="2"></el-option>
            <el-option label="设备名" value="3"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getResultInfo"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="result-table">
      <el-table :data="resultInfo" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="{ row, $index }">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="检测结果">
                <span style="font-size: 30px">{{ row.result }}</span>
              </el-form-item>
              <el-form-item label="近视程度">
                <el-tag v-if="row.level == 0" type="success" effect="dark">
                  视力正常
                </el-tag>
                <el-tag v-else-if="row.level == 1" type="info" effect="dark">
                  轻度近视
                </el-tag>
                <el-tag v-else-if="row.level == 2" type="warning" effect="dark">
                  中度近视
                </el-tag>
                <el-tag v-else type="danger" effect="dark"> 重度近视 </el-tag>
              </el-form-item>
              <el-form-item label="所在班级">
                <span>{{ row.className }}</span>
              </el-form-item>
              <el-form-item label="学生联系电话">
                <span>{{ row.phone }}</span>
              </el-form-item>
              <el-form-item label="建议">
                <span>{{ row.advice }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="结果ID" prop="testId"> </el-table-column>
        <el-table-column label="学生姓名" prop="studentName"> </el-table-column>
        <el-table-column label="设备名" prop="deviceName"> </el-table-column>
        <el-table-column label="检测时间" prop="testTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button
              type="text"
              size="small"
              style="color: orange"
              @click="editResult(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog">
      <el-dialog
        title="视力检测结果信息"
        :visible.sync="dialogFormVisible"
        :show-close="false"
      >
        <el-form :model="changedResult" label-width="80px">
          <el-form-item label="结果ID">
            {{ changedResult.testId }}
          </el-form-item>
          <el-form-item label="检测结果">
            <el-input
              type="number"
              v-model.number="changedResult.result"
              :step="0.1"
              style="width: 100px"
            ></el-input>
          </el-form-item>
          <el-form-item label="近视程度">
            <el-select v-model="changedResult.level">
              <el-option
                v-for="item in level"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建议">
            <el-input type="textarea" v-model="changedResult.advice"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelClick">取 消</el-button>
          <el-button type="primary" @click="confirmClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
export default {
  name: "Result",
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
    ...mapState("result", ["resultInfo"]),
    schoolArray() {
      return this.schoolInfoList.map((school) => ({
        value: school.schoolId,
        label: school.schoolName,
      }));
    },
    classArray() {
      const startItem = {
        value: null,
        label: "",
      };
      return this.selectSchool == null
        ? []
        : [
            startItem,
            ...this.classInfoList.map((myClass) => ({
              value: myClass.classId,
              label: myClass.className,
            })),
          ];
    },
  },
  data() {
    return {
      selectClass: null,
      selectSchool: null,
      select: "1",
      input: "",
      level: [
        {
          value: 0,
          label: "视力正常",
        },
        {
          value: 1,
          label: "轻度近视",
        },
        {
          value: 2,
          label: "中度近视",
        },
        {
          value: 3,
          label: "重度近视",
        },
      ],
      changedResult: {
        testId: null,
        result: null,
        level: null,
        advice: "",
      },
      dialogFormVisible: false,
    };
  },
  methods: {
    removeClassLS() {
      this.selectClass = null;
      localStorage.removeItem("classId");
    },
    getResultInfo() {
      let selectInfo = {
        selectClass: this.selectClass,
        selectSchool: this.selectSchool,
        select: this.select,
        input: this.input,
      };
      this.$store.dispatch("result/getResultInfo", selectInfo).catch((err) => {
        this.$message({
          type: "error",
          message: err,
        });
      });
    },
    editResult(row) {
      this.changedResult = {
        testId: row.testId,
        result: row.result,
        level: row.level,
        advice: row.advice,
      };
      this.dialogFormVisible = true;
    },
    cancelClick() {
      this.dialogFormVisible = false;
      this.changedResult = {
        testId: null,
        result: null,
        level: null,
        advice: "",
      };
    },
    confirmClick() {
      this.$store
        .dispatch("result/updateResultInfo", this.changedResult)
        .then(() => {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.getResultInfo();
          this.cancelClick();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "修改失败",
          });
        });
    },
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
          this.getResultInfo();
        }
      },
    },
    selectClass: {
      deep: true,
      handler(newValue) {
        if (newValue != null) {
          localStorage.setItem("classId", crypto.Encrypt(newValue));
        }
        this.getResultInfo();
      },
    },
    select: {
      deep: true,
      handler(newValue) {
        if (newValue != null) {
          this.input = "";
        }
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

.top::before,
.top::after {
  content: "";
  display: table;
}

.top::after {
  clear: both;
}

.top-left {
  float: left;
}

.top-right {
  float: right;
}

.result-table {
  margin-top: 30px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
