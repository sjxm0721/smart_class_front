<template>
  <div class="subject-intro">
    <h1>{{ subject.title }}</h1>
    <el-divider></el-divider>
    <p class="subject-brief">{{ subject.brief }}</p>
    <div class="subject-detail" v-html="subject.detail"></div>
  </div>
</template>

<script>
export default {
  name: 'SubjectIntro',
  props: ['subject']
}
</script>

<style scoped>
.subject-brief {
  color: #909399;
}
.subject-detail {
  line-height: 1.8;
}
</style>
