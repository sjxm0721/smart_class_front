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
  mounted() {
    // 处理移动端视口高度
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', setViewportHeight);
  },
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

.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;  /* 改变高度计算方式 */
  position: relative; /* 确保定位正确 */
}

/* 添加全局样式 */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 防止横向滚动 */
}

/* 确保主容器可以正确展开 */
#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* 优化移动端样式 */
@media screen and (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
    height: auto;
    min-height: calc(100vh - 64px); /* 移动端导航栏通常更小 */
  }

  .module-card {
    margin-bottom: 15px;
    pointer-events: auto !important; /* 确保可点击 */
  }

  /* 确保内容可以正常点击 */
  .module-content {
    position: relative;
    z-index: 1;
  }
}

.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* 增加 iOS 滚动顺畅度 */
}

/* 重置基础样式 */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
  position: relative;
  -webkit-text-size-adjust: 100%; /* 防止 iOS 文字大小自动调整 */
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 移动端特定样式 */
@media screen and (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
    height: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: fixed;
    top: 64px; /* 导航栏高度 */
    left: 0;
    right: 0;
    bottom: 0;
  }

  .welcome-section {
    margin-bottom: 20px;
  }

  .welcome-card {
    margin-bottom: 15px;
  }

  .modules-section {
    padding-bottom: 20px; /* 确保底部有足够空间 */
  }

  .module-card {
    margin-bottom: 15px;
    transform: none !important; /* 禁用悬停效果 */
    touch-action: manipulation; /* 优化触摸操作 */
  }

  .module-content {
    padding: 15px;
    touch-action: manipulation;
  }

  /* 优化触摸区域 */
  .module-card,
  .module-content,
  .welcome-card {
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0,0,0,0); /* 移除点击高亮 */
    user-select: none; /* 防止文本选择 */
  }

  /* 确保内容可以正常点击 */
  .module-content {
    position: relative;
    z-index: 2;
  }

  /* 调整文字大小 */
  .welcome-text h1 {
    font-size: 18px;
    line-height: 1.3;
  }

  .module-info h3 {
    font-size: 16px;
  }

  .module-info p {
    font-size: 13px;
  }
}

/* 处理 iOS 安全区域 */
@supports (padding-top: env(safe-area-inset-top)) {
  .dashboard-container {
    padding-top: calc(20px + env(safe-area-inset-top));
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }
}
</style>
