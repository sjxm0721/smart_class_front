<!-- dashboard首页组件 先不用修改 -->
<template>
  <div class="dashboard-container">
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
      @change="handlerChangeResultStatus"
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
    <div class="board1" v-show="isDisabled2 == false">
      <span class="board-font">数据总览</span> {{ today }}
      <div class="board1-container">
        <div class="box">
          <div>设备总数</div>
          <div class="box-number">
            {{ deviceNumber === null ? 0 : deviceNumber }}
          </div>
        </div>
        <div class="box">
          <div>教师总数</div>
          <div class="box-number">
            {{ teacherNumber === null ? 0 : teacherNumber }}
          </div>
        </div>
        <div class="box">
          <div>学生总数</div>
          <div class="box-number">
            {{ studentNumber === null ? 0 : studentNumber }}
          </div>
        </div>
        <div class="box">
          <div>昨日测量总数</div>
          <div class="box-number">{{ yesResultTime===null?0:yesResultTime }}</div>
        </div>
      </div>
    </div>
    <div class="board2">
      <span class="board-font">视力情况</span> {{ today }}
      <div id="chart1" style="width: 100%; height: 250px"></div>
    </div>
    <div class="board3">
      <span class="board-font">测试情况</span> {{ today }}
      <div class="block">
        <el-date-picker
          v-model="timeBetween"
          type="datetimerange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <div id="chart2" style="width: 100%; height: 250px"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import crypto from "@/utils/crypto";
import * as echarts from "echarts";
export default {
  name: "Dashboard",
  computed: {
    selectInfo() {
      return {
        schoolId: this.selectSchool,
        classId: this.selectClass,
        today: 1,
      };
    },
    isDisabled1() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1";
    },
    isDisabled2() {
      const userAuth = crypto.Decrypt(localStorage.getItem("user_auth"));
      return userAuth !== "1" && userAuth !== "2";
    },
    ...mapState("school", ["schoolInfoList"]),
    ...mapState("myClass", ["classInfoList"]),
    ...mapState("device", ["deviceNumber"]),
    ...mapState("student", ["studentNumber","studentSightStatus"]),
    ...mapState("account", ["teacherNumber"]),
    ...mapState("result",["yesResultTime","resultStatus"]),
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
    timeStart(){
      return this.getYesterday()+' '+'00:00:00';
    },
    timeEnd(){
      return this.getYesterday()+' '+'23:59:59';
    }
  },
  data() {
    return {
      selectSchool: null,
      selectClass: null,
      today: "",
      chart1Data:[],
      chart2Data:[],
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeBetween:[],
    };
  },
  methods: {
    getCurrentDate() {
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      var day = today.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var time = year + "-" + month + "-" + day;
      return time;
    },
    getYesterday(){
      var yes = new Date(new Date()-3600*1000*24);
      var year = yes.getFullYear();
      var month = yes.getMonth() + 1;
      var day = yes.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var time = year + "-" + month + "-" + day;
      return time;
    },
    removeClassLS() {
      this.selectClass = null;
      localStorage.removeItem("classId");
      this.handlerChangeResultStatus();
    },
    getTeacherNumber() {
      this.$store
        .dispatch("account/getTeacherNumber", this.selectInfo)
        .catch(() => {
          this.$message({
            type: "error",
            message: "获取教师数量失败",
          });
        });
    },
    getStudentNumberAndSight() {
      this.$store
        .dispatch("student/getStudentNumberAndSight", this.selectInfo)
        .then(()=>{
          this.chart1Data=this.studentSightStatus;
          this.initChart1();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "获取学生数量与视力分布列表失败",
          });
        });
    },
    getDeviceNumber() {
      this.$store
        .dispatch("device/getDeviceNumber", this.selectInfo)
        .catch(() => {
          this.$message({
            type: "error",
            message: "获取设备数量失败",
          });
        });
    },
    getYesResultTime(){
      let info={
        schoolId:this.selectSchool,
        classId:this.selectClass,
        timeStart:this.timeStart,
        timeEnd:this.timeEnd,
      }
      this.$store.dispatch("result/getYesResultTime",info)
      .catch(()=>{
        this.$message({
          type:'error',
          message:'获取昨日测试次数失败',
        })
      })
    },
    getResultStatus(){
      let info={
        schoolId:this.selectSchool,
        classId:this.selectClass,
        timeStart:this.timeBetween[0],
        timeEnd:this.timeBetween[1]
      }
      this.$store.dispatch("result/getResultStatus",info)
      .then(()=>{
        this.chart2Data=this.resultStatus;
        this.initChart2();
      })
      .catch(()=>{
        this.$message({
          type:'error',
          message:'获取测试结果分布失败'
        })
      })
    },
    handlerChangeResultStatus(){
      this.getResultStatus();
    },
    getBoard1Info() {
      this.getTeacherNumber();
      this.getDeviceNumber();
      this.getYesResultTime();
      this.getStudentNumberAndSight();
    },
    initChart1() {
      const chartContainer = document.getElementById("chart1");
      var myChart = echarts.getInstanceByDom(chartContainer);

      if(!myChart){
        myChart = echarts.init(chartContainer);
      }

      var option;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["视力正常", "0~200度", "200~400度", "400度以上"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "人数",
            type: "bar",
            barWidth: "60%",
            data: this.chart1Data,
            itemStyle: {
              color: function (params) {
                if (params.name === "400度以上") return "lightcoral";
                else if (params.name === "200~400度") return "lightsalmon";
                else if (params.name === "0~200度") return "lightblue";
                else return "lightgreen";
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
    initChart2() {
      const chartContainer = document.getElementById("chart2");
      var myChart = echarts.getInstanceByDom(chartContainer);

      if(!myChart){
        myChart = echarts.init(chartContainer);
      }
      var option;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["4.0~4.4", "4.4~4.7", "4.7~5.0", "5.0以上"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "人数",
            type: "bar",
            barWidth: "60%",
            data: this.chart2Data,
            itemStyle: {
              color: function (params) {
                if (params.name === "4.0~4.4") return "lightcoral";
                else if (params.name === "4.4~4.7") return "lightsalmon";
                else if (params.name === "4.7~5.0") return "lightblue";
                else return "lightgreen";
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
  },
  mounted() {
    this.today = this.getCurrentDate();
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
    };
    this.$nextTick(()=>{
      this.timeBetween=[
        this.timeStart,this.timeEnd
      ]
    })
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
          this.getBoard1Info();
        }
      },
    },
    selectClass: {
      deep: true,
      handler(newValue) {
        if (newValue != null) {
          localStorage.setItem("classId", crypto.Encrypt(newValue));
        }
        this.getBoard1Info();
      },
    },
    timeBetween:{
      deep:true,
      handler(newValue){
        if(newValue!=[]){
          if(this.selectSchool!=null){
            this.getResultStatus();
          }
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.board {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}
.board1 {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}
.board2 {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}
.board3 {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
}

.board1-container {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
}

.board-font {
  font-size: 20px;
  font-weight: bold;
}

.box {
  width: 180px;
  height: 120px;
  background-color: rgba(144, 283, 144, 0.2);
  border-radius: 5px;
  margin: 20px;
  padding: 10px;
}

.box-number {
  font-size: 40px;
  margin: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.block{
  position: absolute;
  top:20px;
  right: 40px;
}
</style>
