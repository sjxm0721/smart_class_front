<template>
  <div class="resource-list">
    <h2>资源列表</h2>
    <ul>
      <li v-for="resource in resources" :key="resource.id" @click="previewResource(resource)">
        <span>{{ resource.name }}</span>
        <span>{{ resource.type }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'Resource',
  data() {
    return {
      resources: [
        { id: 1, name: '文档1.txt', path: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/2018.2%E7%89%88%E6%9C%AC%E4%BB%A5%E5%8F%8A%E4%B9%8B%E5%90%8E%E7%9B%B4%E5%88%B0%E6%9C%80%E6%96%B0%E7%89%88%E6%9C%AC%E7%9A%84%E6%BF%80%E6%B4%BB%E7%A0%81.txt', type: 'text' },
        { id: 2, name: '文档2.pdf', path: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/2112190525-%E5%90%B4%E7%AD%96%E5%AE%87.pdf', type: 'pdf' },
        { id: 3, name: '视频1.mp4', path: '/path/to/video1.mp4', type: 'video' },
        { id: 4, name: '图片1.jpg', path: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/%E8%BA%AB%E4%BB%BD%E8%AF%81%E5%A4%8D%E5%8D%B0%E4%BB%B6-%E5%90%B4%E7%AD%96%E5%AE%87.jpg', type: 'image' }
      ]
    };
  },
  methods: {
    previewResource(resource) {
      this.$router.push({ name: 'ResourceDetail', params: { resource: resource } });
    }
  }
};
</script>

<style scoped>
.resource-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

li:hover {
  background-color: #f5f5f5;
}
</style>
