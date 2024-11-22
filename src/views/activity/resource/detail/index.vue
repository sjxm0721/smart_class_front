<template>
  <div class="resource-preview">
    <header>
      <h2>{{ resource.name }}</h2>
      <button @click="goBack">返回</button>
    </header>
    <main>
      <div v-if="resource.type === 'text'" class="text-preview">
        <pre>{{ textContent }}</pre>
      </div>
      <div v-else-if="resource.type === 'pdf'" class="pdf-preview">
        <div class="pdf-controls" v-if="canvasReady">
          <button @click="prevPage" :disabled="currentPage <= 1">上一页</button>
          <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages">下一页</button>
          <select v-model="scale" class="scale-select">
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1.0">100%</option>
            <option value="1.25">125%</option>
            <option value="1.5">150%</option>
            <option value="2.0">200%</option>
            <option value="auto">适应页面</option>
          </select>
        </div>
        <div class="canvas-container" ref="canvasContainer">
          <canvas ref="pdfCanvas" v-show="canvasReady"></canvas>
          <div v-if="!canvasReady" class="loading">加载中...</div>
          <div v-if="pdfError" class="error">{{ pdfError }}</div>
        </div>
      </div>
      <div v-else-if="resource.type === 'video'" class="video-preview">
        <video ref="videoPlayer" class="video-js" controls></video>
      </div>
      <div v-else-if="resource.type === 'image'" class="image-preview">
        <img :src="resource.path" alt="Image Preview">
      </div>
      <div v-else-if="['doc', 'docx'].includes(resource.type)" class="doc-preview">
        <iframe :src="docUrl" frameborder="0" width="100%" height="600px"></iframe>
      </div>
    </main>
    <footer>
      <p>© 2023 Resource Preview. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist/webpack';
import videojs from 'video.js';
import _ from 'lodash';  // 添加lodash引入

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf/pdf.worker.js';

export default {
  name: 'ResourceDetail',
  data() {
    return {
      resource: {},
      textContent: '',
      docUrl: '',
      canvasReady: false,
      pdfError: null,
      currentPage: 1,
      totalPages: 0,
      scale: 1,
      pdfDoc: null,
      renderTask: null,
      isRendering: false
    };
  },
  mounted() {
    this.initializeResource();
    // 添加resize监听器
    this.resizeHandler = _.debounce(this.handleResize, 300);
    window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy() {
    // 清理资源
    if (this.pdfDoc) {
      this.pdfDoc.destroy();
    }
    if (this.renderTask) {
      this.renderTask.cancel();
    }
    window.removeEventListener('resize', this.resizeHandler);
  },
  watch: {
    currentPage() {
      if (this.resource.type === 'pdf' && !this.isRendering) {
        this.renderPDFPage();
      }
    },
    scale() {
      if (this.resource.type === 'pdf' && !this.isRendering) {
        this.renderPDFPage();
      }
    }
  },
  methods: {
    handleResize() {
      if (this.resource.type === 'pdf' && this.pdfDoc) {
        this.renderPDFPage(true);
      }
    },
    initializeResource() {
      this.resource = this.$route.params.resource;

      if (this.resource) {
        this.$nextTick(() => {
          this.previewResource();
        });
      } else {
        this.$watch('resource', (newVal) => {
          if (newVal) {
            this.$nextTick(() => {
              this.previewResource();
            });
          }
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    previewResource() {
      try {
        switch (this.resource.type) {
          case 'text':
            this.previewTextFile();
            break;
          case 'pdf':
            this.previewPDFFile();
            break;
          case 'video':
            this.previewVideoFile();
            break;
          case 'doc':
          case 'docx':
            this.previewDocFile();
            break;
        }
      } catch (error) {
        console.error('预览资源时发生错误:', error);
      }
    },
    async previewTextFile() {
      try {
        const response = await fetch(this.resource.path);
        const text = await response.text();
        this.textContent = text;
      } catch (error) {
        console.error('获取文本文件失败:', error);
        this.textContent = '加载文件失败';
      }
    },
    async previewPDFFile() {
      try {
        this.pdfError = null;
        this.canvasReady = false;
        this.isRendering = true;

        if (this.renderTask) {
          await this.renderTask.cancel();
          this.renderTask = null;
        }

        const loadingTask = pdfjsLib.getDocument({
          url: this.resource.path,
          cMapUrl: '/pdf/cmaps/',
          cMapPacked: true
        });

        this.pdfDoc = await loadingTask.promise;
        console.log('PDF加载完成，总页数:', this.pdfDoc.numPages);

        this.totalPages = this.pdfDoc.numPages;
        this.currentPage = 1;

        await this.renderPDFPage(true);
      } catch (error) {
        console.error('PDF加载失败:', error);
        this.pdfError = '无法加载PDF文件';
        this.canvasReady = false;
      } finally {
        this.isRendering = false;
      }
    },
    async renderPDFPage(isInitial = false) {
      if (!this.pdfDoc) return;

      try {
        this.isRendering = true;

        if (this.renderTask) {
          await this.renderTask.cancel();
          this.renderTask = null;
        }

        const canvas = this.$refs.pdfCanvas;
        const container = this.$refs.canvasContainer;

        if (!canvas || !container) {
          console.warn('Canvas or container not ready');
          return;
        }

        // 获取当前页
        const page = await this.pdfDoc.getPage(this.currentPage);

        // 从页面直接获取原始尺寸
        const pageWidth = page.view[2]; // 原始宽度
        const pageHeight = page.view[3]; // 原始高度
        console.log('Original page size:', pageWidth, pageHeight);

        // 获取容器宽度
        const containerWidth = container.clientWidth - 40; // 减去padding

        // 计算缩放比例
        let scale=1.0;
        if (this.scale === 'auto' || isInitial) {
          scale = containerWidth / pageWidth;
          scale = Math.min(Math.max(scale, 0.5), 2.0); // 限制缩放范围
          if (isInitial) {
            this.scale = scale.toString();
          }
        } else {
          scale = parseFloat(this.scale) || 1.0;
        }


        // 创建viewport（添加0度旋转来修正倒立问题）
        const viewport = page.getViewport(scale);

        // 计算最终尺寸
        const finalWidth = pageWidth * scale;
        const finalHeight = pageHeight * scale;

        // 设置canvas尺寸
        canvas.width = finalWidth;
        canvas.height = finalHeight;

        console.log('Final canvas size:', finalWidth, finalHeight);

        // 获取渲染上下文
        const context = canvas.getContext('2d', { alpha: false });

        // 清除画布并设置白色背景
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);





        console.log("viewport",viewport)

        // 准备渲染上下文
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          enableWebGL: false,
          renderInteractiveForms: true,
          background: 'white',
        };

        // 开始渲染
        this.renderTask = page.render(renderContext);
        await this.renderTask.promise;


        console.log('Render complete with scale:', scale);
        this.canvasReady = true;

      } catch (error) {
        if (error.name === 'RenderingCancelled') {
          console.log('取消了之前的渲染');
          return;
        }
        console.error('PDF页面渲染失败:', error);
        this.pdfError = '渲染PDF页面时出错';
        this.canvasReady = false;
      } finally {
        this.isRendering = false;
      }
    },
    previewVideoFile() {
      try {
        const videoElement = this.$refs.videoPlayer;
        if (!videoElement) {
          console.warn('Video element not found');
          return;
        }

        const options = {
          autoplay: false,
          controls: true,
          sources: [{
            src: this.resource.path,
            type: 'video/mp4'
          }]
        };

        videojs(videoElement, options);
      } catch (error) {
        console.error('视频播放器初始化失败:', error);
      }
    },
    previewDocFile() {
      this.docUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(this.resource.path)}`;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style scoped>
.resource-preview {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
}

h2 {
  font-size: 24px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #357abd;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

main {
  flex: 1;
  padding: 20px;
}

.canvas-container {
  width: 100%;
  min-height: 500px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: flex-start;  /* 改回 flex-start 避免垂直居中导致的滚动问题 */
  position: relative;
  padding: 20px;
  overflow: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.pdf-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pdf-controls {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba(248, 249, 250, 0.95);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.pdf-controls select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
}

.pdf-preview canvas {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: block;
  margin: 0 auto;
  transition: transform 0.2s ease;
  transform-origin: top center;
}

/* 调整加载和错误提示的位置 */
.loading, .error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error {
  color: #dc3545;
}

/* 滚动条样式 */
.canvas-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.canvas-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.canvas-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.canvas-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 其他样式保持不变 */
.text-preview pre {
  white-space: pre-wrap;
  font-size: 16px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.video-preview {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.image-preview img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.doc-preview {
  width: 100%;
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

footer {
  padding: 20px;
  background-color: #f5f5f5;
  text-align: center;
  color: #666;
}
</style>
