<template>
  <div class="chapter-detail">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="player-wrap">
          <div class="player-container">
            <video-player
              ref="videoPlayer"
              :options="playerOptions"
              class="video-player"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chapter-list">
          <el-card>
            <div slot="header">
              <span>章节目录</span>
            </div>
            <el-tree
              :data="chapterTree"
              node-key="id"
              default-expand-all
              @node-click="handleChapterClick"
            >
              <span slot-scope="{ node, data }">
                <span>{{ data.title }}</span>
                <span v-if="!data.is_father" class="chapter-duration">
                  {{ formatDuration(data.duration) }}
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

export default {
  name: 'ChapterDetail',
  components: {
    videoPlayer
  },
  data() {
    return {
      playerOptions: {
        sources: [{
          src: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/annoriki.mp4',
          type: 'video/mp4'
        }],
        autoplay: false,
        fluid: true,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      },
      subjectId: null,
      chapterTree: []
    }
  },
  created() {
    const chapterId = this.$route.params.chapterId;
    this.subjectId = this.$route.params.subjectId;
    this.getChapterList();
  },
  methods: {
    async getChapterList() {
      // TODO: 请求后端接口,获取章节列表数据
      // 这里暂时使用模拟数据
      const mockChapterList = [
        {
          id: 1,
          subject_id: this.subjectId,
          chapter_num: '1',
          is_father: 1,
          father_chapter_id: null,
          title: '第一章 绪论',
          url: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/annoriki.mp4',
          duration: 1800
        },
        {
          id: 2,
          subject_id: this.subjectId,
          chapter_num: '1.1',
          is_father: 0,
          father_chapter_id: 1,
          title: '1.1 什么是形势与政策',
          url: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/annoriki.mp4',
          duration: 1800
        },
        {
          id: 3,
          subject_id: this.subjectId,
          chapter_num: '1.2',
          is_father: 0,
          father_chapter_id: 1,
          title: '1.2 学习形势与政策的重要意义',
          url: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/annoriki.mp4',
          duration: 2100
        },
        {
          id: 4,
          subject_id: this.subjectId,
          chapter_num: '2',
          is_father: 1,
          father_chapter_id: null,
          title: '第二章 中美关系'
        },
        {
          id: 5,
          subject_id: this.subjectId,
          chapter_num: '2.1',
          is_father: 0,
          father_chapter_id: 4,
          title: '2.1 中美建交历程',
          url: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/annoriki.mp4',
          duration: 1500
        },
        {
          id: 6,
          subject_id: this.subjectId,
          chapter_num: '2.2',
          is_father: 0,
          father_chapter_id: 4,
          title: '2.2 中美贸易摩擦',
          url: 'https://bilibilipropost.oss-cn-beijing.aliyuncs.com/annoriki.mp4',
          duration: 1980
        }
      ];
      const generateTree = (list, fatherId) => {
        return list
          .filter(item => item.father_chapter_id === fatherId)
          .map(item => ({
            ...item,
            children: generateTree(list, item.id)
          }));
      };

      this.chapterTree = generateTree(mockChapterList, null);
    },

    handleChapterClick(data) {
      if (!data.is_father) {
        this.playerOptions.sources[0].src = data.url;

        this.$nextTick(() => {
          if (this.$refs.videoPlayer && this.$refs.videoPlayer.player) {
            this.$refs.videoPlayer.player.load();
          }
        });
      }
    },

    formatDuration(duration) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }
}
</script>

<style scoped>
.chapter-detail {
  padding: 20px;
}
.player-wrap {
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 */
  position: relative;
}
.player-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden; /* 添加此行,避免视频溢出 */
}
.video-player {
  width: 100% !important; /* 添加 !important 以确保样式优先级 */
  height: 100% !important;
  object-fit: cover; /* 添加此行,保持视频纵横比并填充容器 */
}
.chapter-list {
  max-height: 600px;
  overflow: auto;
}
.chapter-duration {
  margin-left: 10px;
  color: #8c939d;
  font-size: 13px;
}
</style>
