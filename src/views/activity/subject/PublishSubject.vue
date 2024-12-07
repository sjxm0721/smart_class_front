<template>
  <el-dialog
    title="发布新课程"
    :visible="true"
    @close="$emit('close')"
    :width="isMobile ? '95%' : '600px'"
    custom-class="publish-dialog"
  >
    <el-form
      ref="publishForm"
      :model="newSubject"
      :rules="rules"
      :label-width="isMobile ? '70px' : '80px'"
      label-position="right"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="newSubject.title"
          placeholder="请输入课程标题"
          class="form-input"
        ></el-input>
      </el-form-item>

      <el-form-item label="简介" prop="brief">
        <el-input
          type="textarea"
          v-model="newSubject.brief"
          :rows="4"
          placeholder="请输入课程简介"
          class="form-input"
        ></el-input>
      </el-form-item>

      <el-form-item label="封面图片" prop="pic">
        <div class="upload-container">
          <el-upload
            class="cover-uploader"
            action="/admin/common/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="cover-image">
            <i v-else class="el-icon-plus cover-icon"></i>
          </el-upload>
          <div class="el-upload__tip">
            只能上传一张jpg/jpeg/png格式图片，且不超过5MB
          </div>
        </div>
      </el-form-item>

      <el-form-item label="开课班级" prop="classId">
        <el-select
          v-model="newSubject.classId"
          placeholder="请选择班级"
          class="form-input"
        >
          <el-option
            v-for="item in classList"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="结课时间" prop="endTime">
        <el-date-picker
          v-model="newSubject.endTime"
          type="date"
          placeholder="选择结课时间"
          class="form-input"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')" class="footer-button">取 消</el-button>
      <el-button type="primary" @click="handlePublish" class="footer-button">发 布</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reqGetAllClassList } from '@/api/activity/myClass'
import { reqAddOrUpdateSubject } from '@/api/activity/subject'
import { mapState } from 'vuex'

export default {
  name: 'PublishSubject',
  data() {
    return {
      isMobile: false,
      imageUrl: '',
      classList: [],
      newSubject: {
        title: '',
        brief: '',
        pic: '',
        classId: '',
        endTime: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 不能选择今天之前的日期
        }
      },
      rules: {
        title: [
          { required: true, message: '请输入课程标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入课程简介', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '请选择开课班级', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择结课时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState("user", ["accountId", "auth"]),
  },
  created() {
    this.fetchClassList()
  },
  mounted() {
    this.checkDevice();
    window.addEventListener('resize', this.checkDevice);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDevice);
  },
  methods: {
    checkDevice() {
      this.isMobile = window.innerWidth <= 768;
    },
    async fetchClassList() {
      if(this.auth != 2) {
        return
      }
      try {
        const res = await reqGetAllClassList(this.accountId)
        if(res.code == 200) {
          this.classList = res.data
        }
      } catch(err) {
        this.$message.error('获取班级列表失败')
      }
    },
    beforeUpload(file) {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isValidType) {
        this.$message.error('上传文件只能是 jpg/jpeg/png 格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }
      return true
    },
    handleUploadSuccess(response) {
      if (response.code === 200) {
        this.imageUrl = response.data // 显示预览
        this.newSubject.pic = response.data // 保存图片URL
        this.$message.success('图片上传成功')
      } else {
        this.$message.error('图片上传失败')
      }
    },
    handleUploadError(err) {
      this.$message.error('图片上传失败: ' + (err.message || '未知错误'))
    },
    async handlePublish() {
      this.$refs.publishForm.validate(async (valid) => {
        if (valid) {
          try {
            if(this.auth != 2) {
              return
            }
            this.newSubject.teacherId = this.accountId
            const res = await reqAddOrUpdateSubject(this.newSubject)
            if (res.code === 200) {
              this.$message.success('发布成功')
              this.$emit('publish-success')
              this.$emit('close')
            } else {
              this.$message.error(res.message || '发布失败')
            }
          } catch (error) {
            this.$message.error('发布失败，请重试')
          }
        }
      })
    }
  }
}
</script>


<style scoped>
.publish-dialog {
border-radius: 8px;
}

.form-input {
width: 100%;
}

.upload-container {
position: relative;
display: flex;
flex-direction: column;
gap: 10px;
}

.cover-uploader {
border: 1px dashed #d9d9d9;
border-radius: 6px;
cursor: pointer;
position: relative;
overflow: hidden;
width: 178px;
height: 178px;
transition: border-color 0.3s;
}

.cover-uploader:hover {
border-color: #409EFF;
}

.cover-icon {
font-size: 28px;
color: #8c939d;
width: 178px;
height: 178px;
line-height: 178px;
text-align: center;
}

.cover-image {
width: 178px;
height: 178px;
display: block;
object-fit: cover;
}

:deep(.el-dialog__body) {
padding: 20px 30px;
}

:deep(.el-form-item__label) {
font-weight: 500;
width: 90px !important;  /* 增加标签宽度 */
}

:deep(.el-form) {
padding-right: 20px;  /* 为表单右侧添加一些间距 */
}

.el-upload__tip {
color: #909399;
font-size: 12px;
line-height: 1.4;
margin-top: 5px;
}

.dialog-footer {
display: flex;
justify-content: flex-end;
gap: 10px;
}

.footer-button {
min-width: 80px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
:deep(.el-dialog__body) {
padding: 15px;
}

:deep(.el-form-item) {
margin-bottom: 15px;
}

:deep(.el-form-item__label) {
font-size: 14px;
width: 80px !important;  /* 移动端稍微减小标签宽度 */
}

:deep(.el-input__inner) {
font-size: 14px;
}

.upload-container {
align-items: center;
}

.cover-uploader,
.cover-icon,
.cover-image {
width: 150px;
height: 150px;
}

.cover-icon {
line-height: 150px;
font-size: 24px;
}

.el-upload__tip {
text-align: center;
padding: 0 10px;
}

.dialog-footer {
flex-direction: column;
gap: 8px;
}

.footer-button {
width: 100%;
margin-left: 0 !important;
}
}

/* 超小屏幕适配 */
@media screen and (max-width: 320px) {
:deep(.el-form-item__label) {
width: 70px !important;  /* 超小屏幕进一步减小标签宽度 */
font-size: 13px;
}

.cover-uploader,
.cover-icon,
.cover-image {
width: 120px;
height: 120px;
}

.cover-icon {
line-height: 120px;
font-size: 20px;
}
}

/* 处理弹窗滚动 */
:deep(.el-dialog__body) {
max-height: calc(90vh - 150px);
overflow-y: auto;
}
</style>
