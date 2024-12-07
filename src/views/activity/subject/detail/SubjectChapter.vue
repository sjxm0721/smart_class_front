<template>
  <div class="subject-chapter">
    <div class="chapter-header">
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog" v-if="auth === 2">
        添加章节
      </el-button>
    </div>

    <el-timeline>
      <el-timeline-item v-for="(chapter, index) in chapterList" :key="chapter.id" :timestamp="chapter.title">
        <el-card class="chapter-card">
          <div class="chapter-title">
            <div class="title-content">{{ chapter.chapterNum }} {{ chapter.title }}</div>
            <div class="chapter-actions" v-if="auth === 2">
              <el-button type="text" icon="el-icon-edit" @click="handleEdit(chapter)">
                <span class="action-text">编辑</span>
              </el-button>
              <el-button type="text" icon="el-icon-delete" @click="handleDelete(chapter, index)">
                <span class="action-text">删除</span>
              </el-button>
            </div>
          </div>

          <!-- 移动端课时列表 -->
          <div class="mobile-lesson-list" v-if="isMobile">
            <div v-for="(lesson, lessonIndex) in chapter.childrenList"
                 :key="lessonIndex"
                 class="mobile-lesson-item"
                 @click="handleLessonClick(lesson)">
              <div class="lesson-info">
                <span class="lesson-title">{{ lesson.chapterNum }} {{ lesson.title }}</span>
              </div>
              <div class="lesson-actions" v-if="auth === 2">
                <el-button type="text" size="mini" @click.stop="handleEditLesson(lesson)">
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button type="text" size="mini" @click.stop="handleDeleteLesson(lesson, chapter, lessonIndex)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </div>
            </div>
          </div>

          <!-- 桌面端课时表格 -->
          <el-table v-else :data="chapter.childrenList" @row-click="handleLessonClick">
            <el-table-column prop="title" label="课时">
              <template slot-scope="scope">
                <span>{{ scope.row.chapterNum }} {{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" v-if="auth === 2">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.stop="handleEditLesson(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click.stop="handleDeleteLesson(scope.row, chapter, index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <!-- 添加/编辑章节对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :width="isMobile ? '90%' : '600px'"
      @close="handleDialogClose"
      class="chapter-dialog">
      <el-form :model="chapterForm" :rules="rules" ref="chapterForm" label-width="100px">
        <el-form-item label="章节标题" prop="title">
          <el-input v-model="chapterForm.title" placeholder="请输入章节标题"></el-input>
        </el-form-item>
        <el-form-item v-for="(lesson, index) in chapterForm.childrenList"
                      :key="index"
                      :label="'课时' + (index+1)"
                      class="lesson-form-item">
          <div class="lesson-input-group">
            <el-input v-model="lesson.title"
                      :placeholder="'请输入课时' + (index+1) + '标题'"
                      class="lesson-input"></el-input>
            <el-input v-model="lesson.url"
                      placeholder="请输入视频URL"
                      class="lesson-input"></el-input>
            <el-button @click.prevent="removeLessonField(lesson, index)"
                       type="danger"
                       size="mini"
                       class="remove-lesson-btn">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="addLessonField" type="primary" plain>新增课时</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑课时对话框 -->
    <el-dialog
      title="编辑课时"
      :visible.sync="lessonDialogVisible"
      :width="isMobile ? '90%' : '500px'"
      class="lesson-dialog">
      <el-form :model="lessonForm" :rules="lessonRules" ref="lessonForm" label-width="100px">
        <el-form-item label="课时标题" prop="title">
          <el-input v-model="lessonForm.title"></el-input>
        </el-form-item>
        <el-form-item label="视频URL" prop="url">
          <el-input v-model="lessonForm.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lessonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleLessonSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import {
  reqAddOrUpdateChapter,
  reqDeleteChapter,
  reqGetChapterList,
  reqUpdateChildrenChapter
} from '@/api/activity/chapter'
import { mapState } from 'vuex'

export default {
  name: 'SubjectChapter',
  props: ['subject'],
  data() {
    return {
      chapterList: null,
      dialogVisible: false,
      dialogType: 'add',
      isMobile: false,
      chapterForm: {
        subjectId: null,
        id: null,
        title: '',
        chapterNum: '',
        childrenList: []
      },
      rules: {
        title: [
          { required: true, message: '请输入章节标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      lessonDialogVisible: false,
      lessonForm: {
        subjectId: null,
        id: null,
        title: '',
        chapterNum: '',
        url: ''
      },
      lessonRules: {
        title: [
          { required: true, message: '请输入课时标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入视频URL', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogType === 'add' ? '添加章节' : '编辑章节'
    },
    ...mapState('user', ['accountId', 'auth'])
  },
  mounted() {
    this.fetchChapterList()
    this.checkDeviceWidth()
    window.addEventListener('resize', this.checkDeviceWidth)
  },
  destroyed() {
    window.removeEventListener('resize', this.checkDeviceWidth)
  },
  methods: {
    async fetchChapterList() {
      let subjectId = this.$route.params.subjectId
      try {
        const res = await reqGetChapterList(subjectId)
        if (res.code == 200) {
          this.chapterList = res.data
        }
      } catch (error) {
        this.$message.error('获取章节列表失败')
      }
    },
    async refreshChapterList() {
      try {
        const res = await reqGetChapterList(this.$route.params.subjectId)
        if (res.code == 200) {
          this.chapterList = res.data
        }
      } catch (error) {
        this.$message.error('刷新章节列表失败')
      }
    },
    handleLessonClick(row) {
      this.$router.push({
        name: 'ChapterDetail',
        params: {
          subjectId: this.subject.id,
          chapterId: row.id
        }
      })
    },
    showAddDialog() {
      if (this.auth !== 2) {
        this.$message.warning('您没有权限进行此操作')
        return
      }
      this.dialogType = 'add'
      this.chapterForm = {
        subjectId: this.$route.params.subjectId,
        id: null,
        title: '',
        chapterNum: `${this.chapterList.length + 1}`,
        childrenList: []
      }
      this.dialogVisible = true
    },
    addLessonField() {
      this.chapterForm.childrenList.push({
        subjectId: this.$route.params.subjectId,
        title: '',
        chapterNum: `${this.chapterForm.chapterNum}-${this.chapterForm.childrenList.length + 1}`,
        url: ''
      })
    },
    async removeLessonField(lesson, index) {
      if (lesson.id) {
        try {
          await reqDeleteChapter(lesson.id)
          this.$message.success('删除课时成功')
          this.chapterForm.childrenList.splice(index, 1)
          this.updateLessonChapterNum()
        } catch (error) {
          this.$message.error('删除课时失败')
        }
      } else {
        this.chapterForm.childrenList.splice(index, 1)
        this.updateLessonChapterNum()
      }
    },
    updateLessonChapterNum() {
      this.chapterForm.childrenList.forEach((lesson, index) => {
        lesson.chapterNum = `${this.chapterForm.chapterNum}-${index + 1}`
      })
    },
    handleEdit(chapter) {
      if (this.auth !== 2) {
        this.$message.warning('您没有权限进行此操作')
        return
      }
      this.dialogType = 'edit'
      this.chapterForm = JSON.parse(JSON.stringify(chapter))
      this.dialogVisible = true
    },
    handleEditLesson(lesson) {
      if (this.auth !== 2) {
        this.$message.warning('您没有权限进行此操作')
        return
      }
      this.lessonForm = JSON.parse(JSON.stringify(lesson))
      this.lessonDialogVisible = true
    },
    async handleDelete(chapter, index) {
      if (this.auth !== 2) {
        this.$message.warning('您没有权限进行此操作')
        return
      }
      this.$confirm('确认删除该章节吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await reqDeleteChapter(chapter.id)
          this.$message.success('删除成功')
          this.chapterList.splice(index, 1)
          this.updateChapterNum(index)
          await this.refreshChapterList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    async handleDeleteLesson(lesson, chapter, index) {
      if (this.auth !== 2) {
        this.$message.warning('您没有权限进行此操作')
        return
      }
      this.$confirm('确认删除该课时吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await reqDeleteChapter(lesson.id)
          this.$message.success('删除成功')
          chapter.childrenList.splice(index, 1)
          await this.refreshChapterList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    updateChapterNum(startIndex) {
      for (let i = startIndex; i < this.chapterList.length; i++) {
        this.chapterList[i].chapterNum = `${i + 1}`
        this.chapterList[i].childrenList.forEach((lesson, index) => {
          lesson.chapterNum = `${i + 1}-${index + 1}`
        })
      }
    },
    handleDialogClose() {
      this.$refs.chapterForm.resetFields()
    },
    async handleSubmit() {
      if (this.auth !== 2) {
        this.$message.warning('您没有权限进行此操作')
        return
      }
      this.$refs.chapterForm.validate(async (valid) => {
        if (valid) {
          try {
            await reqAddOrUpdateChapter(this.chapterForm)
            this.$message.success(this.dialogType === 'add' ? '添加成功' : '更新成功')
            this.dialogVisible = false
            await this.refreshChapterList()
          } catch (error) {
            this.$message.error(this.dialogType === 'add' ? '添加失败' : '更新失败')
          }
        }
      })
    },
    checkDeviceWidth() {
      this.isMobile = window.innerWidth <= 768
    },
    async handleLessonSubmit() {
      if (this.auth !== 2) {
        this.$message.warning('您没有权限进行此操作')
        return
      }
      this.$refs.lessonForm.validate(async (valid) => {
        if (valid) {
          try {
            await reqUpdateChildrenChapter(this.lessonForm)
            this.$message.success('更新成功')
            this.lessonDialogVisible = false
            await this.refreshChapterList()
          } catch (error) {
            this.$message.error('更新失败')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.subject-chapter {
  padding: 20px;
}

.chapter-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.chapter-card {
  margin-bottom: 20px;
}

.chapter-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.title-content {
  font-size: 18px;
  font-weight: bold;
}

.chapter-actions {
  display: flex;
  gap: 10px;
}

/* 移动端样式 */
@media screen and (max-width: 768px) {
  .subject-chapter {
    padding: 10px;
  }

  .chapter-header {
    margin-bottom: 15px;
  }

  .title-content {
    font-size: 16px;
  }

  .action-text {
    display: none;
  }

  .mobile-lesson-list {
    border: 1px solid #EBEEF5;
    border-radius: 4px;
  }

  .mobile-lesson-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #EBEEF5;
    cursor: pointer;
  }

  .mobile-lesson-item:last-child {
    border-bottom: none;
  }

  .lesson-info {
    flex: 1;
    margin-right: 10px;
  }

  .lesson-title {
    font-size: 14px;
  }

  .lesson-actions {
    display: flex;
    gap: 5px;
  }

  /* 表单样式调整 */
  .lesson-form-item {
    margin-bottom: 20px;
  }

  .lesson-input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .lesson-input {
    width: 100%;
    margin: 0;
  }

  .remove-lesson-btn {
    align-self: flex-end;
  }

  /* Dialog样式调整 */
  .chapter-dialog .el-dialog,
  .lesson-dialog .el-dialog {
    width: 90% !important;
    margin-top: 20vh !important;
  }

  .el-dialog__body {
    padding: 15px !important;
  }

  .el-dialog .el-input {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
}

/* 桌面端样式保持不变 */
.el-dialog .el-input {
  width: 80%;
  margin-right: 10px;
}

.el-dialog .el-button--text {
  margin-left: 10px;
}
</style>
