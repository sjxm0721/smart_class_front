<template>
  <div class="submit-detail">
    <h2>作业提交详情</h2>

    <el-card class="detail-info">
      <div slot="header">
        <span>提交信息</span>
      </div>
      <div>
        <p><strong>作业标题:</strong> {{ submit.homeworkTitle }}</p>
        <p><strong>提交时间:</strong> {{ submit.submitTime }}</p>
        <p>
          <strong>批改状态:</strong>
          <el-tag :type="submit.isCorrected ? 'success' : 'warning'">
            {{ submit.isCorrected ? '已批改' : '未批改' }}
          </el-tag>
        </p>
        <p><strong>评分:</strong> {{ submit.score }}</p>
      </div>
    </el-card>

    <el-card class="detail-content">
      <div slot="header">
        <span>作业内容</span>
      </div>
      <div>
        <pre>{{ submit.content }}</pre>
      </div>
    </el-card>

    <el-card class="detail-comment" v-if="isTeacher">
      <div slot="header">
        <span>教师评价</span>
      </div>
      <div>
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
        <p>{{ submit.comment }}</p>
      </div>
    </el-card>

    <el-button type="info" @click="goBack">返回列表</el-button>
  </div>
</template>

<script>
export default {
  name:'SubmitDetail',
  data() {
    return {
      submit: {}, // 作业提交详情
      isTeacher: true, // 是否为教师视角
      comment: '',
      score: null
    }
  },
  methods: {
    fetchSubmitDetail() {
      // 根据路由参数中的作业提交ID,从后端API获取作业提交详情数据
      const submitId = this.$route.params.id;
      // 这里假设通过 this.$http.get(url) 发送请求并将结果赋值给 this.submit
      // 如: this.submit = response.data;
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
    }
  },
  created() {
    this.fetchSubmitDetail();
  }
}
</script>
