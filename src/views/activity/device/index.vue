<template>
  <div>
    <div class="border">
      <div class="header-all">
        <div class="header-left">
          <span style="margin-left: 20px">学校名称：</span>
          <el-select
            v-model="selectSchool"
            placeholder="请选择"
            style="width: 150px"
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
            style="width: 120px"
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
          <span style="margin-left: 20px">类型：</span>
          <el-select
            v-model="selectType"
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="item in typeEnum"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="header-right">
          <el-button type="success" @click="showApprovalDialog">
            审批管理<i class="el-icon-s-check el-icon--right"></i>
          </el-button>
          <el-button type="primary" @click="addOrEditDevice(null)">
            添加设备<i class="el-icon-plus el-icon--right"></i>
          </el-button>

          <!-- 新增批量导入功能 -->
          <el-upload
            class="upload-btn"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
            accept=".xlsx,.xls"
          >
            <el-button type="warning" style="margin-left: 10px">
              批量导入<i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>

          <el-button type="info" style="margin-left: 10px" @click="downloadTemplate">
            下载模板<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </div>
      </div>
      <div class="body-all">
        <el-table :data="devicePageInfo" max-height="500">
          <el-table-column
            label="设备名"
            prop="deviceName"
            width="150"
          ></el-table-column>
          <el-table-column
            label="类型"
            prop="typeValue"
            width="150"
          ></el-table-column>
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
          <el-table-column label="出借学生" width="150" prop="studentName">
          </el-table-column>
          <el-table-column label="出借班级" width="150" prop="className">
          </el-table-column>
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
              >编辑
              </el-button
              >

              <el-button
                slot="reference"
                type="danger"
                size="mini"
                style="margin-left: 10px"
              >删除
              </el-button
              >
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
        <el-dialog
          title="设备申请审批"
          :visible.sync="approvalDialogVisible"
          width="800px"
          :close-on-click-modal="false"
        >
          <div class="approval-container">
            <el-table :data="approvalList" border v-loading="loadingApprovals">
              <el-table-column prop="deviceName" label="设备名称" width="150"></el-table-column>
              <el-table-column prop="studentName" label="申请学生" width="120"></el-table-column>
              <el-table-column prop="startTime" label="开始时间">
                <template slot-scope="scope">
                  {{ formatDate(scope.row.startTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="endTime" label="结束时间">
                <template slot-scope="scope">
                  {{ formatDate(scope.row.endTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="ddescribe" label="用途说明" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="success"
                    size="small"
                    @click="handleApprove(scope.row, true)"
                  >同意</el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleApprove(scope.row, false)"
                  >拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
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
import { mapState } from 'vuex'
import crypto from '@/utils/crypto'
import { reqDeviceExcelImport } from '@/api/activity/device'
import { getPendingApprovals, handleApproval } from '@/api/activity/deviceBorrow'

export default {
  name: 'Device',
  computed: {
    isDisabled() {
      const userAuth = crypto.Decrypt(localStorage.getItem('user_auth'))
      return userAuth !== '1'
    },
    ...mapState('school', ['schoolInfoList']),
    ...mapState('myClass', ['classInfoList']),
    ...mapState('device', ['devicePageInfo', 'total']),
    schoolArray() {
      const startItem = {
        value: null,
        label: ''
      }
      return [
        startItem,
        ...this.schoolInfoList.map((school) => ({
          value: school.schoolId,
          label: school.schoolName
        }))
      ]
    },
    classArray() {
      return this.classInfoList.map((myClass) => ({
        value: myClass.classId,
        label: myClass.className
      }))
    }
  },
  data() {
    return {
      selectSchool: '', //下拉框所选择的学校
      selectStatus: '', //下拉框所选择的状态
      selectType: '',
      approvalDialogVisible: false,
      approvalList: [],
      loadingApprovals: false,
      input: '',
      typeEnum: [
        {
          value: null,
          label: ''
        },
        {
          value: 0,
          label: '笔记本电脑'
        },
        {
          value: 1,
          label: '平板电脑'
        },
        {
          value: 2,
          label: '投影仪'
        },
        {
          value: 3,
          label: '其他'
        }
      ],
      inUse: [
        {
          value: null,
          label: ''
        },
        {
          value: 0,
          label: '未使用'
        },
        {
          value: 1,
          label: '使用中'
        }
      ],
      isFault: [
        {
          value: null,
          label: ''
        },
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '故障'
        }
      ],
      deviceInfo: {
        deviceId: null,
        deviceName: '',
        schoolId: null,
        classId: null,
        isFault: null,
        lastRepairTime: ''
      },
      pageSize: 5,
      currentPage: 1,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      uploadLoading: false
    }
  },
  methods: {
    getDevicePageInfo() {
      const pageInfo = {
        schoolId: this.selectSchool,
        inUse: this.selectStatus,
        input: this.input,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        type: this.selectType
      }
      this.$store
        .dispatch('device/getDevicePageInfo', pageInfo)
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getDevicePageInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDevicePageInfo()
    },
    changeInput() {
      this.currentPage = 1
      this.getDevicePageInfo()
    },
    addOrEditDevice(row) {
      if (row != null) {
        this.deviceInfo.deviceId = row.deviceId
        this.deviceInfo.schoolId = row.schoolId
        this.deviceInfo.deviceName = row.deviceName
        this.deviceInfo.isFault = row.isFault
        this.deviceInfo.lastRepairTime = row.lastRepairTime
      }
      this.dialogFormVisible = true
    },
    cancelClick() {
      this.dialogFormVisible = false
      this.deviceInfo = {
        deviceId: null,
        deviceName: '',
        schoolId: this.isDisabled == true ? this.$store.getters.schoolId : null,
        classId: '',
        lastRepairTime: '',
        isFault: null
      }
    },
    confirmClick() {
      if (this.deviceInfo.deviceId != null) {
        //修改操作
        this.$store
          .dispatch('device/updateDevice', this.deviceInfo)
          .then(() => {
            this.$message({
              type: 'success',
              message: '更新设备成功'
            })
            this.getDevicePageInfo()
            this.dialogFormVisible = false
            this.deviceInfo = {
              deviceId: null,
              deviceName: '',
              schoolId:
                this.isDisabled == true ? this.$store.getters.schoolId : null,
              classId: '',
              lastRepairTime: '',
              isFault: null
            }
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      } else {
        //新增操作
        this.$store
          .dispatch('device/addDevice', this.deviceInfo)
          .then(() => {
            this.$message({
              type: 'success',
              message: '新增设备成功'
            })
            this.getDevicePageInfo()
            this.dialogFormVisible = false
            this.deviceInfo = {
              deviceId: null,
              deviceName: '',
              schoolId:
                this.isDisabled == true ? this.$store.getters.schoolId : null,
              classId: '',
              lastRepairTime: '',
              isFault: null
            }
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      }
    },
    bindClass(row) {
      this.deviceInfo.deviceId = row.deviceId
      this.deviceInfo.deviceName = row.deviceName
      this.deviceInfo.isFault = row.isFault
      this.deviceInfo.lastRepairTime = row.lastRepairTime
      if (row.schoolId == null) {
        this.$message({
          type: 'error',
          message: '请先选择班级'
        })
      } else {
        this.$store
          .dispatch('myClass/getClassInfoList', row.schoolId)
          .then(() => {
            this.dialogFormVisible2 = true
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '获取班级信息列表失败'
            })
          })
      }
    },
    clearBind(row) {
      this.$store
        .dispatch('device/clearBindWithClass', row.deviceId)
        .then(() => {
          this.$message({
            type: 'success',
            message: '解绑班级成功'
          })
          this.getDevicePageInfo()
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    },
    cancelClick2() {
      this.dialogFormVisible2 = false
      this.deviceInfo = {
        deviceId: null,
        deviceName: '',
        schoolId: this.isDisabled == true ? this.$store.getters.schoolId : null,
        classId: '',
        lastRepairTime: '',
        isFault: null
      }
    },
    confirmClick2() {
      this.$store
        .dispatch('device/updateDevice', this.deviceInfo)
        .then(() => {
          this.$message({
            type: 'success',
            message: '绑定班级成功'
          })
          this.getDevicePageInfo()
          this.dialogFormVisible2 = false
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      this.deviceInfo = {
        deviceId: null,
        deviceName: '',
        schoolId: this.isDisabled == true ? this.$store.getters.schoolId : null,
        classId: '',
        lastRepairTime: '',
        isFault: null
      }
    },
    deleteDevice(row) {
      this.$store
        .dispatch('device/deleteDevice', row.deviceId)
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除设备成功'
          })
          this.getDevicePageInfo()
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    },
    async handleUpload({ file }) {
      if (!this.selectSchool) {
        this.$message.error('请先选择学校!')
        return
      }

      try {
        this.uploadLoading = true
        const formData = new FormData()
        formData.append('file', file)
        formData.append('schoolId', this.selectSchool.toString())

        const result = await reqDeviceExcelImport(formData)

        if (result.code == 200) {
          this.$message.success('导入成功')
          // 刷新设备列表
          this.getDevicePageInfo()
        } else {
          this.$message.error(result.msg || '导入失败')
        }
      } catch (error) {
        this.$message.error('导入失败')
        console.error('导入错误：', error)
      } finally {
        this.uploadLoading = false
      }
    },

    beforeUpload(file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isExcel) {
        this.$message.error('只能上传Excel文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 2MB!')
        return false
      }

      if (!this.selectSchool) {
        this.$message.error('请先选择学校!')
        return false
      }

      return true
    },

    downloadTemplate() {
      // 替换成实际的模板下载地址
      window.open('https://bilibilipropost.oss-cn-beijing.aliyuncs.com/device.xlsx', '_blank')
    },

    // 显示审批弹窗
    async showApprovalDialog() {
      this.approvalDialogVisible = true;
      await this.fetchApprovalList();
    },

    // 获取审批列表
    async fetchApprovalList() {
      this.loadingApprovals = true;
      try {
        const res = await getPendingApprovals({
          schoolId: this.selectSchool
        });
        if (res.code === 200) {
          this.approvalList = res.data;
        } else {
          this.$message.error(res.msg || '获取审批列表失败');
        }
      } catch (error) {
        console.error('获取审批列表失败:', error);
        this.$message.error('获取审批列表失败');
      } finally {
        this.loadingApprovals = false;
      }
    },

    // 处理审批
    async handleApprove(row, isApprove) {
      try {
        await this.$confirm(
          `确定${isApprove ? '同意' : '拒绝'}该申请吗？`,
          '提示',
          {
            type: isApprove ? 'success' : 'warning'
          }
        );

        const res = await handleApproval({
          id: row.id,
          approved: isApprove
        });

        if (res.code === 200) {
          this.$message.success(`${isApprove ? '已同意' : '已拒绝'}该申请`);
          await this.fetchApprovalList();
          this.getDevicePageInfo(); // 刷新设备列表
        } else {
          this.$message.error(res.msg || '操作失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('审批操作失败:', error);
          this.$message.error('操作失败');
        }
      }
    },

    formatDate(date) {
      if (!date) return '--';
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  },
  created() {
    if (this.isDisabled) {
      this.deviceInfo.schoolId = this.$store.getters.schoolId
    }
  },
  mounted() {
    this.$store.dispatch('school/getSchoolInfoList')
    if (this.isDisabled == true) {
      this.selectSchool = this.$store.getters.schoolId
    } else {
      if (localStorage.getItem('schoolId') != null) {
        this.selectSchool = parseInt(
          crypto.Decrypt(localStorage.getItem('schoolId'))
        )
      }
    }
    this.getDevicePageInfo()
  },
  watch: {
    selectSchool: {
      handler(newValue) {
        this.currentPage = 1
        this.getDevicePageInfo()
      }
    },
    selectStatus: {
      handler(newValue) {
        this.currentPage = 1
        this.getDevicePageInfo()
      }
    },
    selectType:{
      handler(newValue) {
        this.currentPage = 1
        this.getDevicePageInfo()
      }
    }
  }
}
</script>

<style>

.border {
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
}

/* 新增上传按钮样式 */
.upload-btn {
  display: inline-block;
}

.upload-btn .el-upload {
  display: inline-block;
}

.header-right {
  float: right;
  display: flex;
  align-items: center;
}

.header-right .el-button {
  margin-bottom: 0;
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

.approval-container {
  margin: -20px;
}

.header-right .el-button {
  margin-left: 10px;
}
</style>
