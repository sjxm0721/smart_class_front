<template>
  <router-link :to="subjectDetailLink" class="course-link">
    <el-card
      :body-style="{ padding: '0px' }"
      shadow="hover"
      class="course-card"
    >
      <el-image
        :src="subject.pic"
        fit="cover"
        class="course-image"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>

      <div class="course-info">
        <h3 class="course-title">{{ subject.title }}</h3>
        <el-tooltip
          :content="subject.brief"
          placement="top"
          :disabled="!isOverflow"
        >
          <p
            class="course-brief"
            ref="briefContent"
            @mouseenter="checkOverflow"
          >{{ subject.brief }}</p>
        </el-tooltip>
        <div class="course-footer">
          <div class="course-tags">
            <el-tag size="small" type="info" class="teacher-tag">
              <i class="el-icon-user"></i>
              {{ subject.teacherName }}
            </el-tag>
            <el-tag size="small" type="success" class="class-tag">
              {{ subject.className }}
            </el-tag>
          </div>
          <el-tag size="small" type="warning">
            <i class="el-icon-time"></i>
            截止: {{ formatEndTime(subject.endTime) }}
          </el-tag>
        </div>
      </div>
    </el-card>
  </router-link>
</template>

<script>
export default {
  name: 'SubjectItem',
  props: {
    subject: {
      type: Object,
      required: true
    }
  },
  computed: {
    subjectDetailLink() {
      return `/subject-detail/${this.subject.id}`
    }
  },
  methods: {
    formatEndTime(dateStr) {
      if (!dateStr) return '未设置'
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
  }
}
</script>

<style scoped>
.course-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 20px;
}

.course-card {
  transition: all 0.3s;
  height: 100%;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image-container {
  width: 100%;
  height: 160px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-image {
  font-size: 60px;
  color: #909399;
}

.course-info {
  padding: 14px;
}

.course-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #303133;
}

.course-brief {
  font-size: 13px;
  color: #666;
  margin: 8px 0;
  height: 40px; /* 稍微增加高度以确保两行完整显示 */
  line-height: 20px; /* 确保每行高度一致 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all; /* 确保长单词也会换行 */
}

/* 添加提示图标 */
.course-brief:hover {
  cursor: pointer;
}


.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
  gap: 8px;
}

.course-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.course-image {
  width: 100%;
  height: 160px;
  display: block;
}


.teacher-tag, .class-tag {
  margin-right: 5px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

:deep(.el-card__body) {
  padding: 0;
}
</style>
