<template>
  <div class="subject-item">
    <img class="item-cover" :src="subject.coverImg" alt="Cover" />

    <div class="item-info">
      <router-link :to="subjectDetailLink">
        <h3 class="item-title">{{ subject.title }}</h3>
      </router-link>
      <div class="item-bottom">
        <p class="item-brief">{{ subject.brief }}</p>
        <p class="item-teacher">教师: {{ subject.teacherName }}</p>
        <div class="item-time">
          <span>开课至 {{ subject.endTime }}</span>
        </div>
      </div>
    </div>

  </div>
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
      return `/subject-detail/${this.subject.id}`;
    }
  }
}
</script>

<style scoped>
.subject-item {
  width: 300px;
  margin: 15px;
  padding: 15px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.item-cover {
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: 5px;
}
.item-title {
  font-size: 18px;
  margin: 10px 0;
}
.item-bottom {
  padding-top: 10px;
  border-top: 1px solid #eee;
}
.item-brief {
  font-size: 14px;
  margin-bottom: 10px;
  color: #666;
}
.item-teacher {
  font-size: 14px;
  color: #999;
}
.item-time {
  text-align: right;
}
</style>
