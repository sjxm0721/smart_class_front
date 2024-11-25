<template>
  <div class="homework-assign">
    <h2>布置作业</h2>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="作业标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作业类型">
        <el-radio-group v-model="form.type" @change="handleTypeChange">
          <el-radio :label="0">面向班级</el-radio>
          <el-radio :label="1">面向个人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="目标班级" v-if="form.type === 0">
        <el-transfer
          v-model="form.classIdList"
          :data="classes"
          :props="{
            key: 'classId',
            label: 'className'
          }"
          :titles="['待选班级', '已选班级']"
          filterable
          filter-placeholder="请输入班级名称"
        ></el-transfer>
      </el-form-item>
      <el-form-item label="目标学生" v-if="form.type === 1">
        <el-transfer
          v-model="form.studentIdList"
          :data="students"
          :props="{
            key: 'studentId',
            label: 'studentName'
          }"
          :titles="['待选学生', '已选学生']"
          filterable
          filter-placeholder="请输入学生名称"
        ></el-transfer>
      </el-form-item>
      <el-form-item label="可见时间">
        <el-date-picker
          v-model="form.sightedTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          v-model="form.completeTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="作业内容">
        <div class="markdown-container">
          <markdown-editor v-model="form.content"></markdown-editor>
        </div>
      </el-form-item>
      <el-form-item label="附件资源">
        <el-upload
          action="/admin/common/upload"
          :on-success="handleUploadSuccess"
          :file-list="fileList"
          :limit="5"
          :on-exceed="handleExceed"
          :before-remove="beforeRemove"
          accept=".jpg,.png,.jpeg,.zip,.rar,.txt,.doc,.docx,.pdf,.mp3,.mp4"
          :on-error="handleUploadError"
          :on-preview="handlePreview"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            支持上传jpg、png、jpeg、zip、rar、txt、doc、docx、pdf、mp3、mp4等文件,单个文件不超过20MB
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { reqGetAllStudentList } from '@/api/activity/student'
import { reqAddHomework } from '@/api/activity/homework'
import { reqGetAllClassList } from '@/api/activity/myClass'
import { mapState } from 'vuex'

export default {
  name: 'HomeworkAdd',
  components: {
    MarkdownEditor
  },
  computed: {
    ...mapState('user', ['accountId', 'auth'])
  },
  data() {
    return {
      form: {
        title: '',
        type: 0,
        classIdList: [],
        studentIdList: [],
        sightedTime: '',
        completeTime: '',
        content: '<p>请输入作业内容</p>',
        resources: []
      },
      students: [],
      classes: [],
      fileList: []
    }
  },
  mounted() {
    this.fetchClasses()
  },
  methods: {
    handleTypeChange() {
      if (this.form.type === 1) {
        this.fetchStudents()
      }
    },
    fetchStudents() {
      if (this.auth === 0) {
        return
      }
      const accountId = this.accountId
      // 发送请求获取学生信息
      reqGetAllStudentList(accountId).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.students = res.data
        } else {
          // 处理错误情况
        }
      }).catch(error => {
        console.error(error)
      })
    },
    fetchClasses() {
      if (this.auth === 0) {
        return
      }
      const accountId = this.accountId
      // 发送请求获取班级信息
      reqGetAllClassList(accountId).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.classes = res.data
        } else {
          // 处理错误情况
        }
      }).catch(error => {
        console.error(error)
      })
    },
    handleUploadSuccess(response, file, fileList) {
      this.form.resources.push(response.data)
      this.fileList = fileList
    },
    handleUploadError(err, file, fileList) {
      this.$message.error(`文件 ${file.name} 上传失败: ${err.message}`)
    },
    handlePreview(file) {
      window.open(file.url, '_blank')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件,本次选择了 ${files.length} 个文件,共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onSubmit() {
      if (this.auth === 0) {
        return
      }
      // 提交表单数据到后端API
      const formData = {
        ...this.form,
        sightedTime: this.formatDate(this.form.sightedTime),
        completeTime: this.formatDate(this.form.completeTime)
      }

      reqAddHomework(formData).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message.success('作业布置成功')
          this.$router.push('/homework')
        } else {
          // 处理错误情况
        }
      }).catch(error => {
        console.error(error)
      })
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
.homework-assign {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.markdown-container {
  height: 400px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.el-date-editor {
  position: relative;
  z-index: 2;
}
</style>
