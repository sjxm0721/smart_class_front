<template>
  <div class="subject-list">
    <!-- 搜索框 -->
    <div class="search-box">
      <input type="text" placeholder="搜索课程" v-model="searchText" @input="searchSubjects">
      <button class="search-btn">搜索</button>
    </div>

    <!-- 添加课程按钮,教师权限可见 -->
    <button v-if="isTeacher" class="add-btn" @click="openPublish">发布新课程</button>

    <div class="list-wrapper">
      <!-- 使用SubjectItem组件渲染单个课程 -->
      <subject-item
        v-for="subject in displayList"
        :key="subject.id"
        :subject="subject"
      />
    </div>

    <!-- 发布课程弹窗组件,根据publishVisible控制显示 -->
    <publish-subject
      v-if="publishVisible"
      @close="closePublish"
      @publish-success="fetchSubjects"
    />
  </div>
</template>

<script>
import SubjectItem from './SubjectItem.vue'
import PublishSubject from './PublishSubject.vue'

export default {
  name: 'Subject',
  components: {
    SubjectItem,
    PublishSubject
  },
  data() {
    return {
      isTeacher: false,   // 是否教师权限
      publishVisible: false,  // 控制发布弹窗显示
      subjectList: [],  // 完整的课程列表数据
      displayList: [],  // 搜索过滤后实际展示的课程列表
      searchText: ''    // 搜索关键词
    }
  },
  created() {
    this.fetchSubjects();
  },
  methods: {
    openPublish() {
      this.publishVisible = true;
    },
    closePublish() {
      this.publishVisible = false;
    },
    fetchSubjects(){
      // TODO: 请求后端接口获取课程列表数据
      // 暂时使用模拟数据
      this.subjectList = [
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        },
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        },
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        },
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        },
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        },
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        },
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        },
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        },
        {
          id: 1,
          title: '形势与政策(4)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2024-05-27',
          teacherName: '张三'
        },
        {
          id: 2,
          title: '形势与政策(6)',
          brief: '浙江工商大学学生课程',
          coverImg: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
          endTime: '2023-10-19',
          teacherName: '李四'
        }
      ];
      this.displayList = this.subjectList;
    },
    searchSubjects() {
      if(!this.searchText) {
        this.displayList = this.subjectList;
      } else {
        this.displayList = this.subjectList.filter(subject =>
          subject.title.includes(this.searchText)
        );
      }
    }
  }
}
</script>

<style scoped>
.search-box {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.search-box input {
  width: 300px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.search-btn {
  margin-left: 10px;
}
.add-btn {
  display: block;
  margin: 15px auto;
}
.list-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1500px;
  margin: 0 auto;
}
</style>
