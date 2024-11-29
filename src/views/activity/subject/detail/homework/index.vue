<template>
  <div class="homework-detail">
    <div class="page-header">
      <div class="back-button">
        <el-button
          type="default"
          icon="el-icon-arrow-left"
          size="small"
          plain
          @click="goBack">
          返回
        </el-button>
      </div>
      <h2 class="homework-title">{{ homework.title }}</h2>
    </div>

    <el-card class="detail-card">
      <div class="homework-info">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <i class="el-icon-time"></i>
              <span class="label">可见时间：</span>
              <span class="value">{{ formatTime(homework.sightedTime) }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <i class="el-icon-timer"></i>
              <span class="label">截止时间：</span>
              <span class="value">{{ formatTime(homework.completeTime) }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="homework-content">
        <h3 class="section-title">
          <i class="el-icon-document"></i>
          作业内容
        </h3>
        <div class="content-wrapper">
          <pre>{{ homework.content }}</pre>
        </div>
      </div>

      <div class="homework-resources" v-if="homework.resources && homework.resources.length">
        <h3 class="section-title">
          <i class="el-icon-folder"></i>
          附件资源
        </h3>
        <el-card shadow="never" class="resource-list">
          <ul>
            <li v-for="(resource, index) in homework.resources" :key="index">
              <i class="el-icon-document"></i>
              <a :href="resource.url" target="_blank" @click="downloadResource(resource)">
                {{ resource.name }}
              </a>
            </li>
          </ul>
        </el-card>
      </div>

      <div class="homework-actions">
        <el-button type="primary" icon="el-icon-download" @click="downloadHomework">
          下载作业
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { reqGetHomeWorkInfo } from '@/api/activity/homework'

export default {
  name: 'SubjectHomeworkDetail',
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
    this.fetchHomeworkDetail();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async fetchHomeworkDetail() {
      const homeworkId = this.$route.params.homeworkId;
      try {
        const res = await reqGetHomeWorkInfo(homeworkId);
        if (res.code === 200) {
          this.homework = res.data;
        } else {
          this.$message.error('获取作业详情失败');
        }
      } catch (error) {
        this.$message.error('获取作业详情失败');
      }
    },
    formatTime(timestamp) {
      if (!timestamp) return '暂未设置';
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
    downloadResource(resource) {
      window.open(resource.url, '_blank');
    },
    downloadHomework() {
      const homeworkUrl = `/api/homework/${this.homework.id}/download`;
      window.open(homeworkUrl, '_blank');
    }
  }
};
</script>

<style scoped>
.homework-detail {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  margin-right: 20px;
}

.homework-title {
  font-size: 24px;
  margin: 0;
  color: #303133;
  flex: 1;
}

.detail-card {
  background-color: #fff;
  border-radius: 8px;
}

.homework-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.info-item {
  display: flex;
  align-items: center;
  color: #606266;
}

.info-item i {
  margin-right: 8px;
  color: #909399;
}

.info-item .label {
  font-weight: 500;
  margin-right: 8px;
}

.section-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 8px;
  color: #409EFF;
}

.content-wrapper {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;
}

.content-wrapper pre {
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin: 0;
  font-family: inherit;
}

.homework-resources {
  margin-bottom: 30px;
}

.resource-list {
  background-color: #f8f9fa;
}

.resource-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.resource-list li {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.resource-list li:last-child {
  margin-bottom: 0;
}

.resource-list i {
  margin-right: 8px;
  color: #909399;
}

.resource-list a {
  color: #409EFF;
  text-decoration: none;
}

.resource-list a:hover {
  color: #66b1ff;
}

.homework-actions {
  text-align: right;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.el-button [class*="el-icon-"] + span {
  margin-left: 8px;
}
</style>
