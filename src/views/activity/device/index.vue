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
          <span style="margin-left: 20px">使用状况：</span>
          <el-select
            v-model="selectStatus"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in inUse"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="addOrEditDevice(null)"
            >添加设备<i class="el-icon-plus el-icon--right"></i
          ></el-button>
        </div>
      </div>
      <div class="body-all">
        <el-table :data="devicePageInfo" max-height="500">
          <el-table-column
            label="设备名"
            prop="deviceName"
            width="150"
          ></el-table-column>
          <el-table-column label="班级名" width="150" prop="className">
          </el-table-column>
          <el-table-column label="设备状态">
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-if="row.isFault == 0">正常</el-tag>
              <el-tag type="danger" v-else>故障</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="使用状况">
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-if="row.inUse == 1">使用中</el-tag>
              <el-tag type="danger" v-else>未使用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="测试次数" prop="testNum"> </el-table-column>
          <el-table-column
            label="上次维修时间"
            prop="lastRepairTime"
            width="150"
          ></el-table-column>
          <el-table-column width="250">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="input"
                size="mini"
                placeholder="输入设备名搜索"
                @change="changeInput"
              />
            </template>
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                size="mini"
                @click="addOrEditDevice(row)"
                >编辑</el-button
              >
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                v-if="row.classId != null"
                @onConfirm="clearBind(row)"
                style="margin-left: 10px;"
                title="确定解绑吗？"
              >
              <el-button
                type="info"
                size="mini"
                slot="reference"
                >解绑班级</el-button
              >
              </el-popconfirm>
             
              <el-button
                type="success"
                size="mini"
                v-else
                @click="bindClass(row)"
                >绑定班级</el-button
              >
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @onConfirm="deleteDevice(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  style="margin-left: 10px"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="设备信息"
          :visible.sync="dialogFormVisible"
          :show-close="false"
        >
          <el-form :model="deviceInfo" label-width="100px">
            <el-form-item label="设备名称">
              <el-input
                v-model="deviceInfo.deviceName"
                style="width: 250px"
              ></el-input>
            </el-form-item>
            <el-form-item label="所在学校">
              <el-select
                v-model="deviceInfo.schoolId"
                :disabled="isDisabled"
                placeholder="请选择所在学校"
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
            <el-form-item label="上次维修时间">
              <template slot-scope="row, $index">
                <el-date-picker
                  v-model="deviceInfo.lastRepairTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </template>
            </el-form-item>
            <el-form-item label="设备状态">
              <el-select
                v-model="deviceInfo.isFault"
                placeholder="请选择设备状态"
              >
                <el-option
                  v-for="item in isFault"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelClick">取 消</el-button>
            <el-button type="primary" @click="confirmClick">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogFormVisible2"
          label-width="100px"
          :show-close="false"
        >
          <el-form :model="deviceInfo">
            <el-form-item label="班级绑定">
              <el-select
                v-model="deviceInfo.classId"
                placeholder="请选择绑定班级"
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
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelClick2">取 消</el-button>
            <el-button type="primary" @click="confirmClick2">确 定</el-button>
          </div>
        </el-dialog>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
export default {
  name: "Device",
  computed: {
    isDisabled() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1";
    },
    ...mapState("school", ["schoolInfoList"]),
    ...mapState("myClass", ["classInfoList"]),
    ...mapState("device", ["devicePageInfo", "total"]),
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
    classArray() {
      return this.classInfoList.map((myClass) => ({
        value: myClass.classId,
        label: myClass.className,
      }));
    },
  },
  data() {
    return {
      selectSchool: "", //下拉框所选择的学校
      selectStatus: "", //下拉框所选择的状态
      input: "",
      inUse: [
        {
          value: null,
          label: "",
        },
        {
          value: 0,
          label: "未使用",
        },
        {
          value: 1,
          label: "使用中",
        },
      ],
      isFault: [
        {
          value: null,
          label: "",
        },
        {
          value: 0,
          label: "正常",
        },
        {
          value: 1,
          label: "故障",
        },
      ],
      deviceInfo: {
        deviceId: null,
        deviceName: "",
        schoolId: null,
        classId: null,
        isFault: null,
        lastRepairTime: "",
      },
      pageSize: 5,
      currentPage: 1,
      dialogFormVisible: false,
      dialogFormVisible2: false,
    };
  },
  methods: {
    getDevicePageInfo() {
      const pageInfo = {
        schoolId: this.selectSchool,
        inUse: this.selectStatus,
        input: this.input,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      this.$store
        .dispatch("device/getDevicePageInfo", pageInfo)
        .catch((err) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDevicePageInfo();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDevicePageInfo();
    },
    changeInput() {
      this.currentPage = 1;
      this.getDevicePageInfo();
    },
    addOrEditDevice(row) {
      if (row != null) {
        this.deviceInfo.deviceId = row.deviceId;
        this.deviceInfo.schoolId = row.schoolId;
        this.deviceInfo.deviceName = row.deviceName;
        this.deviceInfo.isFault = row.isFault;
        this.deviceInfo.lastRepairTime = row.lastRepairTime;
      }
      this.dialogFormVisible = true;
    },
    cancelClick() {
      this.dialogFormVisible = false;
      this.deviceInfo = {
        deviceId: null,
        deviceName: "",
        schoolId: this.isDisabled == true ? this.$store.getters.schoolId : null,
        classId: "",
        lastRepairTime: "",
        isFault: null,
      };
    },
    confirmClick() {
      if (this.deviceInfo.deviceId != null) {
        //修改操作
        this.$store
          .dispatch("device/updateDevice", this.deviceInfo)
          .then(() => {
            this.$message({
              type: "success",
              message: "更新设备成功",
            });
            this.getDevicePageInfo();
            this.dialogFormVisible = false;
            this.deviceInfo = {
              deviceId: null,
              deviceName: "",
              schoolId:
                this.isDisabled == true ? this.$store.getters.schoolId : null,
              classId: "",
              lastRepairTime: "",
              isFault: null,
            };
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err,
            });
          });
      } else {
        //新增操作
        this.$store
          .dispatch("device/addDevice", this.deviceInfo)
          .then(() => {
            this.$message({
              type: "success",
              message: "新增设备成功",
            });
            this.getDevicePageInfo();
            this.dialogFormVisible = false;
            this.deviceInfo = {
              deviceId: null,
              deviceName: "",
              schoolId:
                this.isDisabled == true ? this.$store.getters.schoolId : null,
              classId: "",
              lastRepairTime: "",
              isFault: null,
            };
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err,
            });
          });
      }
    },
    bindClass(row) {
      this.deviceInfo.deviceId = row.deviceId;
      if (row.schoolId == null) {
        this.$message({
          type: "error",
          message: "请先选择班级",
        });
      } else {
        this.$store
          .dispatch("myClass/getClassInfoList", row.schoolId)
          .then(() => {
            this.dialogFormVisible2 = true;
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "获取班级信息列表失败",
            });
          });
      }
    },
    clearBind(row) {
      this.$store
        .dispatch("device/clearBindWithClass", row.deviceId)
        .then(() => {
          this.$message({
            type: "success",
            message: "解绑班级成功",
          });
          this.getDevicePageInfo();
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
    },
    cancelClick2() {
      this.dialogFormVisible2 = false;
      this.deviceInfo = {
        deviceId: null,
        deviceName: "",
        schoolId: this.isDisabled == true ? this.$store.getters.schoolId : null,
        classId: "",
        lastRepairTime: "",
        isFault: null,
      };
    },
    confirmClick2() {
      this.$store
        .dispatch("device/updateDevice", this.deviceInfo)
        .then(() => {
          this.$message({
            type: "success",
            message: "绑定班级成功",
          });
          this.getDevicePageInfo();
          this.dialogFormVisible2 = false;
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
      this.deviceInfo = {
        deviceId: null,
        deviceName: "",
        schoolId: this.isDisabled == true ? this.$store.getters.schoolId : null,
        classId: "",
        lastRepairTime: "",
        isFault: null,
      };
    },
    deleteDevice(row) {
      this.$store
        .dispatch("device/deleteDevice", row.deviceId)
        .then(() => {
          this.$message({
            type: "success",
            message: "删除设备成功",
          });
          this.getDevicePageInfo();
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
    },
  },
  created() {
    if (this.isDisabled) {
      this.deviceInfo.schoolId = this.$store.getters.schoolId;
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
    this.getDevicePageInfo();
  },
  watch: {
    selectSchool: {
      handler(newValue) {
        this.currentPage = 1;
        this.getDevicePageInfo();
      },
    },
    selectStatus: {
      handler(newValue) {
        this.currentPage = 1;
        this.getDevicePageInfo();
      },
    },
  },
};
</script>

<style>
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
