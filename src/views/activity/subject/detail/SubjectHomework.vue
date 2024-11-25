<template>
  <div class="subject-homework">
    <el-card v-for="homework in subject.homeworks" :key="homework.id">
      <div slot="header">
        <span>{{ homework.title }}</span>
        <el-tag :type="homework.status === 'pending' ? 'danger' : 'success'" size="small">
          {{ homework.status === 'pending' ? '未提交' : '已提交' }}
        </el-tag>
      </div>
      <p>{{ homework.content }}</p>
      <p>
        <i class="el-icon-time"></i>
        <span>截止日期: {{ homework.deadline }}</span>
      </p>
      <el-button type="primary" size="small">提交作业</el-button>
    </el-card>
    <el-empty v-if="!subject.homeworks.length" description="暂无作业"></el-empty>
  </div>
</template>

<script>
export default {
  name: 'SubjectHomework',
  props: ['subject']
}
</script>
