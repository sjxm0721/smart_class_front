<template>
  <div class="publish-subject">
    <div class="modal">
      <h2>发布新课程</h2>
      <form @submit.prevent="handlePublish">
        <div class="form-item">
          <label>标题</label>
          <input v-model="newSubject.title" required>
        </div>
        <div class="form-item">
          <label>简介</label>
          <textarea v-model="newSubject.brief" required></textarea>
        </div>
        <div class="form-item">
          <label>封面</label>
          <input type="file" @change="handleCoverUpload">
        </div>
        <div class="form-item">
          <label>开课班级</label>
          <select v-model="newSubject.classId" required>
            <option disabled value="">请选择班级</option>
            <option
              v-for="c in classList"
              :key="c.id"
              :value="c.id"
            >{{ c.name }}
            </option>
          </select>
        </div>
        <div class="form-item">
          <label>结课时间</label>
          <input type="date" v-model="newSubject.endTime" required>
        </div>
        <div class="form-btn">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="submit">发布</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublishSubject',
  data() {
    return {
      classList: [],
      newSubject: {
        title: '',
        brief: '',
        coverImg: '',
        classId: '',
        endTime: ''
      }
    }
  },
  created() {
    this.fetchClassList();
  },
  methods: {
    async fetchClassList() {
      // TODO: 请求后端接口获取班级列表
      // 暂时使用模拟数据
      this.classList = [
        { id: 1, name: '计算机1班' },
        { id: 2, name: '计算机2班' }
      ];
    },
    handleCoverUpload(e) {
      // TODO: 上传封面图片到服务器，获取图片url
      const file = e.target.files[0];
      console.log(file);
      this.newSubject.coverImg = 'uploaded.png';
    },
    async handlePublish() {
      // TODO: 请求后端接口发布课程
      console.log(this.newSubject);

      // TODO: 处理发布成功，关闭弹窗，刷新列表
      this.$emit('publish-success');
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.publish-subject {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.modal {
  width: 500px;
  background: #fff;
  border-radius: 5px;
  padding: 20px;
}
.form-item {
  margin: 10px;
}
.form-item label {
  display: block;
  margin-bottom: 5px;
}
.form-btn {
  text-align: right;
  padding: 10px;
}
.form-btn button {
  margin-left: 15px;
}
</style>
