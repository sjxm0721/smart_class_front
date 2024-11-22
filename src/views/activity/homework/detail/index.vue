<template>
  <div class="all">
    <div class="body2" v-show="true">
      <div class="classInc">
      </div>
      <div class="addStudentBtn">
        <div class="btn-on-bottom">
          <el-input
            placeholder="请输入作业名"
            prefix-icon="el-icon-search"
            style="width: 150px; margin-left: 10px"
            size="small"
            @change="getHomeWorkInfoList"
            v-model="homeworkInput"
          >
          </el-input>
        </div>
        <div class="btn-on-top">
          <el-button
            type="primary"
            @click="addHomeWork"
            size="small"
            style="margin-left: 10px"
          >布置作业<i class="el-icon-plus el-icon--right"></i
          ></el-button>
        </div>
      </div>
      <div class="studentInf">
        <el-table
          :data="formattedHomeworkInfoList"
          style="width: 100%"
          max-height="500"
          height="500"
          ref="studentInfoList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="demo-table-expand">
                <el-form-item label="作业名称">
                  <span>{{ props.row.title }}</span>
                </el-form-item>
                <el-form-item label="布置时间">
                  <span>{{ props.row.sightedTime }}</span>
                </el-form-item>
                <el-form-item label="截止时间">
                  <span>{{ props.row.completeTime }}</span>
                </el-form-item>
                <el-form-item label="完成情况">
                  <span>{{ props.row.completeSituation }}</span>
                </el-form-item>
                <el-form-item label="作业类型">
                  <span>{{ props.row.type===0?'面向班级':'面向个人'}}</span>
                </el-form-item>
                <el-form-item label="目标对象">
                  <span>{{ props.row.target }}</span>
                </el-form-item>
                <el-form-item label="已完成名单">
                  <span>{{ props.row.studentCompleted }}</span>
                </el-form-item>
                <el-form-item label="未完成名单">
                  <span>{{ props.row.studentNotCompleted }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column fixed prop="title" label="作业名称" width="180" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="类型" width="120">
            <template slot-scope="{ row, $index }">
              <el-tag v-if="row.type === 0">面向班级</el-tag>
              <el-tag type="success" v-else>面向个人</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="target" label="目标对象" width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="sightedTime" label="发布时间" width="150">
          </el-table-column>
          <el-table-column prop="completeTime" label="截止时间" width="150">
          </el-table-column>
          <el-table-column prop="completeSituation" label="完成情况" width="120">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <el-button
                @click.native.prevent="editHomework(row)"
                type="text"
                size="small"
                style="color: skyblue;"
              >
                详情
              </el-button>
              <el-button
                @click.native.prevent="editHomework(row)"
                type="text"
                size="small"
                style="color: orange;margin-left: 20px !important;"
              >
                修改
              </el-button>
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="deleteHomework(row)"
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "HomeWorkDetail",
  computed: {
    ...mapState("user",["accountId"]),
    ...mapState("homework", ["homeworkInfoList"]),
    formattedHomeworkInfoList() {
      return this.homeworkInfoList.map(item => ({
        ...item,
        sightedTime: this.formatTimestamp(item.sightedTime),
        completeTime: this.formatTimestamp(item.completeTime),
        completeSituation: item.curNum +" / "+item.totalNum
      }));
    }
  },
  data() {
    return {
      homeworkInput: "",
      studentName: "",
    };
  },
  mounted() {
    this.getHomeWorkInfoList();
  },
  methods: {
    addHomeWork(){

    },
    getHomeWorkInfoList(){
      let homeWorkTotalInfo = {
        input:this.homeworkInput,
        teacherId:this.accountId
      };
      this.$store
        .dispatch("homework/getHomeWorkInfoList", homeWorkTotalInfo)
        .then((res)=>{
          console.log(res)
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
    },
    handleSelectionChange(){

    },
    editHomework(row){

    },
    deleteHomework(row){

    },
    toggleSelected(){

    },
    deleteSelected(){

    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
  },
  watch: {
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
  flex-direction: row;
  justify-content:space-between ;
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
