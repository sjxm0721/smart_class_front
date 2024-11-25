<template>
  <div class="subject-resource">
    <el-row :gutter="20">
      <el-col :span="8" v-for="resource in subject.resources" :key="resource.id">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img :src="resource.cover" class="resource-cover">
          <div class="resource-info">
            <h3>{{ resource.title }}</h3>
            <p>{{ resource.brief }}</p>
            <div class="resource-button">
              <el-button type="text" @click="download(resource.url)">下载资料</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!subject.resources.length" description="暂无资料"></el-empty>
  </div>
</template>

<script>
export default {
  name: 'SubjectResource',
  props: ['subject'],
  methods: {
    download(url) {
      window.open(url, '_blank');
    }
  }
}
</script>

<style scoped>
.resource-cover {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}
.resource-info {
  padding: 14px;
}
.resource-button {
  text-align: right;
  padding: 0 10px 10px;
}
</style>
