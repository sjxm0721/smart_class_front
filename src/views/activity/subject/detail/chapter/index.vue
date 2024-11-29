<template>
  <div class="chapter-detail">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="player-wrap">
          <div class="player-container">
            <video-player
              ref="videoPlayer"
              :options="playerOptions"
              :playsinline="true"
              class="video-player"
              @ready="onPlayerReady"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chapter-list">
          <el-card shadow="never">
            <div slot="header" class="chapter-header">
              <span class="header-title">章节目录</span>
            </div>
            <el-tree
              :data="chapterList"
              node-key="id"
              :props="defaultProps"
              default-expand-all
              @node-click="handleChapterClick"
              class="custom-tree"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="chapter-title">
                  <span class="chapter-num">{{ data.chapterNum }}</span>
                  {{ data.title }}
                </span>
                <span v-if="!data.isFather" class="chapter-info">
                  <i class="el-icon-video-play"></i>
                </span>
              </span>
            </el-tree>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'
import { reqGetChapterInfo, reqGetChapterList } from '@/api/activity/chapter'

export default {
  name: 'ChapterDetail',
  components: {
    videoPlayer
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false,
        muted: false,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: ''
        }],
        poster: '', // 封面图
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 不支持提示
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,
          volumePanel: {
            inline: false
          }
        }
      },
      chapterList: [],
      chapterInfo: null,
      defaultProps: {
        children: 'childrenList',
        label: 'title'
      }
    }
  },
  created() {
    this.fetchChapterList()
    this.fetchChapterInfo()
  },
  methods: {
    onPlayerReady(player) {
      // 播放器初始化完成
      this.player = player
    },
    async fetchChapterInfo() {
      try {
        const chapterId = this.$route.params.chapterId
        const res = await reqGetChapterInfo(chapterId)
        if (res.code === 200 && res.data) {
          this.chapterInfo = res.data
          // 更新视频源
          if (res.data.url) {
            this.updateVideoSource(res.data.url)
          }
        }
      } catch (error) {
        this.$message.error('获取章节信息失败')
      }
    },
    async fetchChapterList() {
      try {
        const subjectId = this.$route.params.subjectId
        const res = await reqGetChapterList(subjectId)
        if (res.code === 200) {
          this.chapterList = res.data
        } else {
          this.$message.error('获取章节列表失败')
        }
      } catch (error) {
        this.$message.error('获取章节列表失败')
      }
    },
    updateVideoSource(url) {
      // 更新视频源
      this.playerOptions.sources = [{
        type: 'video/mp4',
        src: url
      }]

      // 确保播放器重新加载视频
      this.$nextTick(() => {
        if (this.$refs.videoPlayer) {
          const player = this.$refs.videoPlayer.player
          if (player) {
            player.src(url)
            player.load()
          }
        }
      })
    },
    handleChapterClick(data) {
      if (!data.isFather) {
        // 更新路由参数
        this.$router.push({
          name: 'ChapterDetail',
          params: {
            subjectId: this.$route.params.subjectId,
            chapterId: data.id
          }
        })

        // 获取新的章节信息
        reqGetChapterInfo(data.id).then(res => {
          if (res.code === 200 && res.data && res.data.url) {
            this.chapterInfo = res.data
            this.updateVideoSource(res.data.url)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
/* 保持原有样式不变 */
.chapter-detail {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 40px);
}

.player-wrap {
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.player-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.video-player {
  width: 100% !important;
  height: 100% !important;
}

.chapter-list {
  max-height: calc(100vh - 80px);
  overflow: auto;
}

.chapter-header {
  padding: 10px 0;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.custom-tree {
  margin-top: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 0;
}

.chapter-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chapter-num {
  color: #409EFF;
  font-weight: 500;
  margin-right: 8px;
}

.chapter-info {
  color: #909399;
  font-size: 14px;
}

:deep(.el-tree-node__content) {
  height: auto;
  padding: 4px 0;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #ecf5ff;
  color: #409EFF;
}

.chapter-list::-webkit-scrollbar {
  width: 6px;
}

.chapter-list::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.chapter-list::-webkit-scrollbar-track {
  background: #f5f7fa;
}

@media screen and (max-width: 768px) {
  .el-row {
    display: flex;
    flex-direction: column;
  }

  .el-col {
    width: 100% !important;
  }

  .chapter-list {
    margin-top: 20px;
    max-height: 400px;
  }
}
</style>
