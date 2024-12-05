<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <el-card class="welcome-card">
        <div class="welcome-content">
          <img src="@/assets/welcome.png" alt="welcome" class="welcome-image">
          <div class="welcome-text">
            <h1>欢迎使用智慧课程开源实践项目管理系统</h1>
            <p>{{ welcomeMessage }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 功能模块区域 -->
    <div class="modules-section">
      <h2 class="section-title">功能导航</h2>
      <el-row :gutter="20">
        <!-- 管理员模块 -->
        <template v-if="auth === 1">
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/school')">
              <div class="module-content">
                <i class="el-icon-school module-icon"></i>
                <div class="module-info">
                  <h3>学校管理</h3>
                  <p>管理学校信息、查看学校详情</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/myClass')">
              <div class="module-content">
                <i class="el-icon-office-building module-icon"></i>
                <div class="module-info">
                  <h3>班级管理</h3>
                  <p>管理班级信息、分配教师</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/account')">
              <div class="module-content">
                <i class="el-icon-user module-icon"></i>
                <div class="module-info">
                  <h3>账号管理</h3>
                  <p>管理用户账号、权限分配</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </template>

        <!-- 教师模块 -->
        <template v-if="auth === 2">
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card highlight" shadow="hover" @click.native="$router.push('/subject')">
              <div class="module-content">
                <i class="el-icon-reading module-icon"></i>
                <div class="module-info">
                  <h3>课程管理</h3>
                  <p>管理课程内容、教学资源</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/device')">
              <div class="module-content">
                <i class="el-icon-cpu module-icon"></i>
                <div class="module-info">
                  <h3>设备管理</h3>
                  <p>管理实验设备、审批租借</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/student')">
              <div class="module-content">
                <i class="el-icon-user-solid module-icon"></i>
                <div class="module-info">
                  <h3>学生管理</h3>
                  <p>管理学生信息、查看成绩</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/homework')">
              <div class="module-content">
                <i class="el-icon-notebook-2 module-icon"></i>
                <div class="module-info">
                  <h3>作业管理</h3>
                  <p>发布作业、查看提交</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/submit')">
              <div class="module-content">
                <i class="el-icon-document-checked module-icon"></i>
                <div class="module-info">
                  <h3>作业批改</h3>
                  <p>批改作业、评分点评</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </template>

        <!-- 学生模块 -->
        <template v-if="auth === 0">
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card highlight" shadow="hover" @click.native="$router.push('/subject')">
              <div class="module-content">
                <i class="el-icon-reading module-icon"></i>
                <div class="module-info">
                  <h3>我的课程</h3>
                  <p>查看课程内容、学习资源</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/device-borrow')">
              <div class="module-content">
                <i class="el-icon-cpu module-icon"></i>
                <div class="module-info">
                  <h3>设备租借</h3>
                  <p>查看设备、申请租借</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/homework')">
              <div class="module-content">
                <i class="el-icon-notebook-2 module-icon"></i>
                <div class="module-info">
                  <h3>我的作业</h3>
                  <p>查看作业、提交作业</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="module-card" shadow="hover" @click.native="$router.push('/submit')">
              <div class="module-content">
                <i class="el-icon-document-checked module-icon"></i>
                <div class="module-info">
                  <h3>作业提交</h3>
                  <p>提交作业、查看评分</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapState('user', ['auth', 'name']),
    welcomeMessage() {
      const roleMap = {
        '0': '同学',
        '1': '管理员',
        '2': '老师'
      }
      return `${this.name}${roleMap[this.auth]}，欢迎回来！`
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-card {
  background: linear-gradient(135deg, #6b8dd6 0%, #8e37d7 100%);
  color: white;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 60px;
}

.welcome-text h1 {
  font-size: 24px;
  margin: 0 0 10px 0;
}

.welcome-text p {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.section-title {
  font-size: 20px;
  color: #303133;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.module-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-card:hover {
  transform: translateY(-5px);
}

.module-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.module-icon {
  font-size: 48px;
  margin-right: 20px;
  color: #409EFF;
}

.module-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
}

.module-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.highlight {
  border: 2px solid #409EFF;
}

.highlight .module-icon {
  color: #409EFF;
}

@media screen and (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }

  .welcome-image {
    width: 80px;
    height: 80px;
  }

  .welcome-text h1 {
    font-size: 20px;
  }

  .module-content {
    flex-direction: column;
    text-align: center;
  }

  .module-icon {
    margin: 0 0 15px 0;
  }
}
</style>
