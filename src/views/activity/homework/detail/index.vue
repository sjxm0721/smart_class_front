<template>
  <div class="homework-detail">
    <h2 class="homework-title">{{ homework.title }}</h2>
    <div class="homework-info">
      <p><strong>可见时间:</strong> {{ formatTime(homework.sightedTime) }}</p>
      <p><strong>截止时间:</strong> {{ formatTime(homework.completeTime) }}</p>
    </div>
    <div class="homework-content">
      <h3>作业内容:</h3>
      <div class="content-wrapper">
        <pre>{{ homework.content }}</pre>
      </div>
    </div>
    <div class="homework-resources">
      <h3>附件资源:</h3>
      <ul>
        <li v-for="(resource, index) in homework.resources" :key="index">
          <a :href="resource.url" target="_blank" @click="downloadResource(resource)">
            {{ resource.name }}
          </a>
        </li>
      </ul>
    </div>
    <div class="homework-actions">
      <el-button type="primary" @click="downloadHomework">下载作业</el-button>
    </div>
  </div>
</template>

<script>
import { reqGetHomeWorkInfo } from '@/api/activity/homework'

export default {
  name:'HomeWorkDetail',
  data() {
    return {
      homework: {
        id: '',
        title: '',
        totalNum: 0,
        curNum: 0,
        content: '',
        resources: []
      }
    };
  },
  mounted() {
    // 从后端API获取作业详情数据
    this.fetchHomeworkDetail();
  },
  methods: {
    async fetchHomeworkDetail() {
      const homeworkId = this.$route.params.homeworkId;
      // 发送请求获取作业详情数据
      reqGetHomeWorkInfo(homeworkId).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.homework = res.data
          // this.homework.sightedTime = this.formatTimestamp(this.homework.sightedTime)
          // this.homework.completeTime = this.formatTimestamp(this.homework.completeTime)
        } else {

        }
      }).catch(error => {

      })
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    downloadResource(resource) {
      // 下载附件资源
      window.open(resource.url, '_blank');
    },
    downloadHomework() {
      // 下载整个作业
      const homeworkUrl = `/api/homework/${this.homework.id}/download`;
      window.open(homeworkUrl, '_blank');
    }
  }
};
</script>

<style scoped>
.homework-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.homework-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.homework-info {
  margin-bottom: 20px;
}

.homework-content {
  margin-bottom: 20px;
}

.content-wrapper {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
}

.content-wrapper pre {
  white-space: pre-wrap;
  font-size: 16px;
  line-height: 1.6;
}

.homework-resources {
  margin-bottom: 20px;
}

.homework-resources ul {
  list-style-type: none;
  padding: 0;
}

.homework-resources li {
  margin-bottom: 10px;
}

.homework-actions {
  text-align: right;
}
</style>
