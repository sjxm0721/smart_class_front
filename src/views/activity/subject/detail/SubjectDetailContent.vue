<template>
  <div class="subject-detail-container">
    <div class="subject-detail">
      <!-- Mobile menu button -->
      <div class="mobile-menu-button" v-show="isMobile">
        <el-button type="text" @click="toggleMobileMenu">
          <i :class="['el-icon-s-unfold', { 'is-active': showMobileMenu }]"></i>
          菜单
        </el-button>
      </div>

      <el-row>
        <!-- Mobile menu overlay -->
        <div class="mobile-menu-overlay" v-show="showMobileMenu && isMobile" @click="toggleMobileMenu"></div>

        <!-- Side menu -->
        <el-col :span="isMobile ? 24 : 4" class="menu-col" :class="{ 'mobile-menu': isMobile }">
          <div class="subject-menu-wrap" :class="{ 'show': showMobileMenu || !isMobile }">
            <div class="home-button-wrap">
              <el-button
                type="primary"
                icon="el-icon-s-home"
                @click="goToHome"
                plain
                class="home-button">
                返回首页
              </el-button>
            </div>
            <el-menu
              :default-active="currentTab"
              class="subject-menu"
              @select="handleMenuSelect">
              <el-menu-item index="intro">课程简介</el-menu-item>
              <el-menu-item index="chapter">章节目录</el-menu-item>
              <el-menu-item index="homework">课程作业</el-menu-item>
              <el-menu-item index="resource">课程资料</el-menu-item>
            </el-menu>
          </div>
        </el-col>

        <!-- Content area -->
        <el-col :span="isMobile ? 24 : 20">
          <div class="subject-content-wrap">
            <div class="subject-content">
              <subject-intro v-if="currentTab === 'intro'" :subject="subject"/>
              <subject-chapter v-if="currentTab === 'chapter'" :subject="subject"/>
              <subject-homework v-if="currentTab === 'homework'" :subject="subject"/>
              <subject-resource v-if="currentTab === 'resource'" :subject="subject"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SubjectIntro from './SubjectIntro.vue'
import SubjectChapter from './SubjectChapter.vue'
import SubjectHomework from './SubjectHomework.vue'
import SubjectResource from './SubjectResource.vue'

export default {
  name: 'SubjectDetailContent',
  components: {
    SubjectIntro,
    SubjectChapter,
    SubjectHomework,
    SubjectResource
  },
  data() {
    return {
      subject: {},
      currentTab: 'intro',
      isMobile: false,
      showMobileMenu: false
    }
  },
  created() {
    const subjectId = this.$route.params.subjectId
    this.fetchSubjectDetail(subjectId)
    this.checkDeviceWidth()
    window.addEventListener('resize', this.checkDeviceWidth)
  },
  destroyed() {
    window.removeEventListener('resize', this.checkDeviceWidth)
  },
  methods: {
    checkDeviceWidth() {
      this.isMobile = window.innerWidth <= 768
      if (!this.isMobile) {
        this.showMobileMenu = false
      }
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
    handleMenuSelect(tab) {
      this.currentTab = tab
      if (this.isMobile) {
        this.showMobileMenu = false
      }
    },
    fetchSubjectDetail(id) {
      // TODO: 发送请求获取课程详情数据
      // 暂时使用模拟数据
      this.subject = {
        id,
        title: '形势与政策(4)',
        brief: '课程简介:《形势与政策》课是一门理论与实践紧密结合的课程...',
        detail: '本课程是一门针对大学生开设的公共必修课,是高校思想政治理论课的重要组成部分...',
        chapters: [
          {
            id: 1,
            title: '第一章 中美贸易摩擦',
            lessons: [
              { id: 1, title: '1.1 中美贸易摩擦始末', duration: '30:00' },
              { id: 2, title: '1.2 中美贸易摩擦原因', duration: '35:00' }
            ]
          },
          {
            id: 2,
            title: '第二章 2022冬奥会',
            lessons: [
              { id: 3, title: '2.1 冬奥会筹备过程', duration: '20:00' },
              { id: 4, title: '2.2 冬奥会举办意义', duration: '25:00' }
            ]
          }
        ],
        homeworks: [
          {
            id: 1,
            title: '中美贸易战论文',
            content: '从宏观经济角度谈谈你对中美贸易战的看法,字数不少于2000字。',
            deadline: '2023-06-01',
            status: 'pending'
          }
        ],
        resources: [
          {
            id: 1,
            title: '形势与政策教学大纲',
            brief: '本文件是形势与政策课程的教学大纲,包括课程目标、内容、考核方式等。',
            cover: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/033970d7-8d7b-458a-9c36-dafb317687ba.jpg',
            url: 'https://example.com/resource1.pdf'
          }
        ]
      }
    },
    switchTab(tab) {
      this.currentTab = tab
    },
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.subject-detail-container {
  background-color: #f5f7fa;
  padding: 20px 0;
}

.subject-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 120px);
}

/* Mobile menu button */
.mobile-menu-button {
  display: none;
  padding: 10px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.mobile-menu-button .el-button {
  font-size: 16px;
}

.mobile-menu-button i {
  margin-right: 5px;
  font-size: 20px;
}

/* Mobile menu overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

/* Menu styles */
.subject-menu-wrap {
  padding: 20px 0;
  border-right: 1px solid #e4e7ed;
}

.subject-menu {
  border-right: none;
  margin-top: 10px;
}

.home-button-wrap {
  padding: 0 20px 20px 20px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 10px;
}

.home-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-button i {
  margin-right: 5px;
}

.subject-menu .el-menu-item {
  font-size: 14px;
  height: 45px;
  line-height: 45px;
}

.subject-menu .el-menu-item:hover {
  background-color: #ecf5ff;
}

.subject-menu .el-menu-item.is-active {
  color: #409EFF;
  background-color: #ecf5ff;
}

/* Content area */
.subject-content-wrap {
  padding: 20px;
}

/* Mobile styles */
@media screen and (max-width: 768px) {
  .subject-detail-container {
    padding: 0;
  }

  .subject-detail {
    border-radius: 0;
    box-shadow: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .menu-col.mobile-menu .subject-menu-wrap {
    position: fixed;
    top: 0;
    left: -80%;
    width: 80%;
    height: 100vh;
    background-color: #fff;
    z-index: 2001;
    transition: left 0.3s ease;
    overflow-y: auto;
  }

  .menu-col.mobile-menu .subject-menu-wrap.show {
    left: 0;
  }

  .subject-content-wrap {
    padding: 15px;
  }
}
</style>
