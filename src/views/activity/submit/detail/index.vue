<template>
  <div class="submit-detail">
    <h2>作业提交详情</h2>

    <el-card class="detail-info">
      <div slot="header">
        <span>提交信息</span>
      </div>
      <div>
        <p><strong>作业标题:</strong> {{ submitInfo.homeworkTitle }}</p>
        <p><strong>提交时间:</strong> {{ submitInfo.submitTime }}</p>
        <p>
          <strong>批改状态:</strong>
          <el-tag :type="submitInfo.isCorrected ? 'success' : 'warning'">
            {{ submitInfo.isCorrected ? '已批改' : '未批改' }}
          </el-tag>
        </p>
        <p><strong>评分:</strong> {{ submitInfo.score?submitInfo.score:'暂无评分' }}</p>
      </div>
    </el-card>

    <el-card class="detail-content">
      <div slot="header">
        <span>作业内容</span>
      </div>
      <div>
        <pre>{{ submitInfo.content }}</pre>
      </div>
    </el-card>

    <el-card class="detail-comment" v-if="isTeacher">
      <div slot="header">
        <span>教师评价</span>
      </div>
      <div>
        <div  style="margin-bottom: 40px" v-if="submitInfo.comment!=null">旧评价：{{submitInfo.comment}}</div>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入评价"
          v-model="comment">
        </el-input>
        <el-input-number v-model="score" :min="0" :max="100" label="评分"></el-input-number>
        <el-button type="primary" @click="saveComment">保存评价</el-button>
      </div>
    </el-card>

    <el-card class="detail-comment" v-else>
      <div slot="header">
        <span>教师评价</span>
      </div>
      <div>
        <p>{{ submitInfo.comment }}</p>
      </div>
    </el-card>

    <el-button type="info" @click="goBack">返回列表</el-button>
  </div>
</template>

<script>
import { reqGetSubmitInfo } from '@/api/activity/submit'

export default {
  name:'SubmitDetail',
  data() {
    return {
      submitInfo: {}, // 作业提交详情
      isTeacher: true, // 是否为教师视角
      comment: '',
      score: null
    }
  },
  methods: {
    async fetchSubmitDetail() {
      // 根据路由参数中的作业提交ID,从后端API获取作业提交详情数据
      const submitId = this.$route.params.submitId;
      console.log(submitId)
      // 这里假设通过 this.$http.get(url) 发送请求并将结果赋值给 this.submit
      // 如: this.submit = response.data;

      reqGetSubmitInfo(submitId).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.submitInfo = res.data
          this.submitInfo.submitTime = this.formatTimestamp(this.submitInfo.submitTime)
        } else {

        }
      }).catch(error => {

      })
    },
    saveComment() {
      // 教师保存评价和评分
      const params = {
        id: this.submit.id,
        comment: this.comment,
        score: this.score
      };
      // 这里假设通过 this.$http.post(url, params) 将评价和评分提交给后端API
    },
    goBack() {
      // 返回作业提交列表页面
      this.$router.go(-1);
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
  created() {
    this.fetchSubmitDetail();
  }
}
</script>
