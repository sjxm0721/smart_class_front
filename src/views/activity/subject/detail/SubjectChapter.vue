<template>
  <div class="subject-chapter">
    <el-timeline>
      <el-timeline-item
        v-for="chapter in subject.chapters"
        :key="chapter.id"
        :timestamp="chapter.title">
        <el-card>
          <el-table :data="chapter.lessons" @row-click="handleLessonClick">
            <el-table-column prop="title" label="课时">
              <template slot-scope="scope">
                <span>{{ scope.row.id }} {{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="时长"></el-table-column>
          </el-table>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'SubjectChapter',
  props: ['subject'],
  methods: {
    handleLessonClick(row) {
      this.$router.push({
        name: 'ChapterDetail',
        params: {
          subjectId: this.subject.id,
          chapterId: row.id
        }
      });
    }
  }
}
</script>
