<template>
  <div class="device-borrow">
    <el-tabs v-model="activeTab" type="card">
      <!-- 可租借设备列表 -->
      <el-tab-pane label="可租借设备" name="available">
        <div class="search-bar">
          <el-input
            v-model="searchKey"
            placeholder="输入设备名称搜索"
            prefix-icon="el-icon-search"
            style="width: 300px"
            @change="handleSearch"
          ></el-input>
          <el-select v-model="deviceType" placeholder="设备类型" style="width: 150px" @change="handleSearch">
            <el-option
              v-for="type in deviceTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            >
              <span style="float: left">{{ type.label }}</span>
            </el-option>
          </el-select>
        </div>

        <el-table :data="availableDevices" border style="width: 100%" v-loading="loading">
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
          <el-table-column prop="typeValue" label="设备类型"></el-table-column>
          <el-table-column label="设备状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isFault ? 'danger' : 'success'">
                {{ scope.row.isFault ? '故障' : '正常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastRepairTime" label="最近维修时间">
            <template slot-scope="scope">
              {{ formatDate(scope.row.lastRepairTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                :disabled="scope.row.isFault"
                @click="handleBorrow(scope.row)"
              >
                申请租借
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-tab-pane>

      <!-- 我的租借记录 -->
      <el-tab-pane label="我的租借" name="myBorrows">
        <el-table :data="myBorrows" border style="width: 100%" v-loading="loadingBorrows">
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
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
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag :type="getBorrowStatusType(scope.row.status)">
                {{ getBorrowStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === 1"
                type="warning"
                size="small"
                @click="handleReturn(scope.row)"
              >
                归还
              </el-button>
              <el-button
                v-if="scope.row.status === 0"
                type="warning"
                size="small"
                @click="deleteBorrow(scope.row)"
              >
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 租借申请对话框 -->
    <el-dialog title="设备租借申请" :visible.sync="borrowDialogVisible" width="500px">
      <el-form :model="borrowForm" ref="borrowForm" :rules="borrowRules" label-width="100px">
        <!-- 修改 el-form-item 部分为 -->
        <el-form-item label="设备名称">
          <span>{{ selectedDevice ? selectedDevice.deviceName : '' }}</span>
        </el-form-item>
        <el-form-item label="租借时间" prop="timeRange">
          <el-date-picker
            v-model="borrowForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用途说明" prop="description">
          <el-input
            type="textarea"
            v-model="borrowForm.description"
            :rows="4"
            placeholder="请简要说明设备用途"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="borrowDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBorrow" :loading="submitting">
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteBorrow,
  getAvailableDevices,
  getMyBorrows,
  returnDevice,
  submitBorrow
} from '@/api/activity/deviceBorrow'
import { mapState } from 'vuex'

export default {
  name: 'DeviceBorrow',
  computed:{
    ...mapState('user',["accountId","auth"])
  },
  data() {
    return {
      activeTab: 'available',
      searchKey: '',
      deviceType: '',
      deviceTypes:[ {
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
        }],
      currentPage: 1,
      pageSize: 10,
      schoolId:'',
      total: 0,
      loading: false,
      loadingBorrows: false,
      availableDevices: [],
      myBorrows: [],
      borrowDialogVisible: false,
      selectedDevice: null,
      submitting: false,
      borrowForm: {
        timeRange: null,
        description: ''
      },
      borrowRules: {
        timeRange: [{ required: true, message: '请选择租借时间', trigger: 'change' }],
        description: [
          { required: true, message: '请填写用途说明', trigger: 'blur' },
          { min: 10, message: '用途说明至少10个字符', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  mounted() {
    this.schoolId = this.$store.getters.schoolId
    this.fetchAvailableDevices();
    this.fetchMyBorrows();
  },
  methods: {
    async fetchAvailableDevices() {
      this.loading = true;
      try {
        const res = await getAvailableDevices({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          searchKey: this.searchKey,
          type: this.deviceType,
          schoolId: this.schoolId
        });
        if (res.code === 200) {
          this.availableDevices = res.data.records;
          this.total = res.data.total;
          console.log(this.availableDevices)
        }
      } catch (error) {
        this.$message.error('获取设备列表失败');
      } finally {
        this.loading = false;
      }
    },
    async fetchMyBorrows() {
      this.loadingBorrows = true;
      try {
        const res = await getMyBorrows(this.accountId);
        if (res.code === 200) {
          this.myBorrows = res.data;
        }
      } catch (error) {
        this.$message.error('获取租借记录失败');
      } finally {
        this.loadingBorrows = false;
      }
    },
    handleSearch() {
      this.currentPage = 1;
      this.fetchAvailableDevices();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchAvailableDevices();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchAvailableDevices();
    },
    handleBorrow(device) {
      this.selectedDevice = device;
      this.borrowDialogVisible = true;
    },
    async submitBorrow() {
      try {
        await this.$refs.borrowForm.validate();
        this.submitting = true;

        // 设置时间为当天的开始和结束
        const startDate = new Date(this.borrowForm.timeRange[0]);
        const endDate = new Date(this.borrowForm.timeRange[1]);
        startDate.setHours(0, 0, 0);
        endDate.setHours(23, 59, 59);

        const submitData = {
          deviceId: this.selectedDevice.deviceId,
          startTime: this.formatDateTime(startDate),
          endTime: this.formatDateTime(endDate),
          accountId: this.accountId,
          description: this.borrowForm.description
        };

        const res = await submitBorrow(submitData);

        if (res.code === 200) {
          this.$message.success('申请提交成功，请等待教师审核');
          this.borrowDialogVisible = false;
          this.fetchAvailableDevices();
          this.fetchMyBorrows();
          this.resetBorrowForm();
        } else {
          this.$message.error(res.msg || '提交失败');
        }
      } catch (error) {
        console.error(error);
        this.$message.error('提交失败');
      } finally {
        this.submitting = false;
      }
    },
    async handleReturn(borrow) {
      try {
        await this.$confirm('确认归还该设备？', '提示', {
          type: 'warning'
        });

        const res = await returnDevice(borrow.id);

        if (res.code === 200) {
          this.$message.success('设备归还成功');
          this.fetchMyBorrows();
          this.fetchAvailableDevices();
        } else {
          this.$message.error(res.msg || '归还失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
          this.$message.error('归还失败');
        }
      }
    },
    async deleteBorrow(borrow) {
      try {
        await this.$confirm('确认取消该申请？', '提示', {
          type: 'warning'
        });

        const res = await deleteBorrow(borrow.id);

        if (res.code === 200) {
          this.$message.success('取消申请成功');
          this.fetchMyBorrows();
          this.fetchAvailableDevices();
        } else {
          this.$message.error(res.msg || '归还失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
          this.$message.error('归还失败');
        }
      }
    },
    resetBorrowForm() {
      this.borrowForm = {
        timeRange: null,
        description: ''
      };
      this.selectedDevice = null;
    },
    getBorrowStatusText(status) {
      const statusMap = {
        0: '申请中',
        1: '使用中',
        2: '已拒绝'
      };
      return statusMap[status] || '未知状态';
    },
    getBorrowStatusType(status) {
      const typeMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      };
      return typeMap[status] || '';
    },
    // 在 methods 中添加一个格式化时间的方法
    formatDateTime(date) {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    formatDate(date) {
      if (!date) return '未设置';
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.device-borrow {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 40px);
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-tabs__nav-wrap) {
  margin-bottom: 20px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
  height: 40px;
  line-height: 40px;
}

:deep(.el-table) {
  margin-top: 10px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
