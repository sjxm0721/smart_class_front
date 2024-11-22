<template>
  <div class="submit-page">
    <h2>学生作业提交</h2>

    <!-- 搜索和筛选条件 -->
    <div class="filters">
      <el-input v-model="searchText" placeholder="搜索作业内容" clearable></el-input>
      <el-select v-model="selectedStatus" placeholder="选择批改状态">
        <el-option label="全部状态" value=""></el-option>
        <el-option label="未批改" value="0"></el-option>
        <el-option label="已批改" value="1"></el-option>
      </el-select>
    </div>

    <!-- 作业提交列表 -->
    <el-table :data="filteredSubmits" style="width: 100%">
      <el-table-column prop="homeworkTitle" label="作业标题"></el-table-column>
      <el-table-column prop="submitTime" label="提交时间"></el-table-column>
      <el-table-column label="批改状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isCorrected ? 'success' : 'warning'">
            {{ scope.row.isCorrected ? '已批改' : '未批改' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="评分"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { reqGetSubmitInfoList } from '@/api/activity/submit'
import { mapState } from "vuex";

export default {
  name:'Submit',
  data() {
    return {
      submits: [], // 作业提交数据
      searchText: '',
      selectedStatus: null,
    }
  },
  computed: {
    filteredSubmits() {
      // 根据搜索和筛选条件过滤作业提交
      return this.submits.filter(submit => {
        const contentMatch = submit.content.includes(this.searchText);
        const statusMatch = this.selectedStatus === '' || submit.isCorrected === (this.selectedStatus === '1');
        return contentMatch && statusMatch;
      });
    },
    ...mapState("user",["accountId","auth"]),
  },
  mounted() {
    this.fetchSubmits();
  },
  methods: {
    async fetchSubmits() {
      // 从后端API获取作业提交数据
      // 这里假设通过 this.$http.get(url) 发送请求并将结果赋值给 this.submits
      // 如: this.submits = response.data;
      let homeworkTotalInfo = {
        input:this.searchText,
        status:this.selectedStatus,
        teacherId:null,
        studentId:null
      }
      if(this.auth===0){
        homeworkTotalInfo.studentId = this.accountId
      }
      if(this.auth===3||this.auth===2||this.auth===1){
        homeworkTotalInfo.teacherId=this.accountId
      }
       reqGetSubmitInfoList(homeworkTotalInfo).then(res=>{
         console.log(res)
         if(res.code === 0){

         }
         else{

         }
       }).catch(error=>{

       })
    },
    viewDetail(id) {
      // 跳转到作业提交详情页
      this.$router.push(`/submit/detail/${id}`);
    }
  },
  created() {
    this.fetchSubmits();
  }
}
</script>
