<template>
  <div class="film-detail" :style="pageBgStyle">
    <!-- 图片区域：占3/4空间 -->
    <div class="image-section">
      <div 
        class="detail-wrapper" 
        :style="cardStyle"
        @click="openVideo"
        v-if="!showVideo && hasVideo"
      >
        <div class="play-overlay">
          <span class="play-icon">▶</span>
          <span class="play-text">点击播放视频</span>
        </div>
      </div>
      
      <!-- 视频播放器 -->
      <div v-if="showVideo" class="video-wrapper">
        <video 
          ref="videoRef"
          :src="item?.video" 
          controls 
          autoplay
          class="detail-video"
        ></video>
        <button class="close-video-btn" @click="closeVideo">×</button>
      </div>
      
      <!-- 非电影页面的普通卡片（无视频） -->
      <div 
        class="detail-wrapper" 
        :style="cardStyle"
        v-if="!showVideo && !hasVideo"
      ></div>
    </div>

    <!-- 文字区域：占1/4空间 -->
    <div class="detail-text">
      <h1 class="detail-title">{{ item?.title || '' }}</h1>
      <p class="detail-subtitle">{{ item?.subtitle || '' }}</p>
      <div class="detail-content" v-html="item?.content || item?.description || ''"></div>
    </div>

    <!-- 返回按钮：固定在右下角 -->
    <button class="module-button" @click="$router.back()">返回</button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { filmItems, artItems, dreamItems } from '../data/exhibits'

const route = useRoute()
const showVideo = ref(false)
const videoRef = ref(null)

const item = computed(() => {
  const id = route.params.id
  const isFilm = route.path.startsWith('/film/')
  const isArt = route.path.startsWith('/art/')
  const isDreams = route.path.startsWith('/dreams/')
  
  if (isFilm) {
    return filmItems.find(item => item.id === id)
  }
  
  if (isArt) {
    const numericId = parseInt(id, 10)
    return artItems.find(item => item.id === numericId)
  }
  
  if (isDreams) {
    const numericId = parseInt(id, 10)
    return dreamItems.find(item => item.id === numericId)
  }
  
  return null
})

const hasVideo = computed(() => {
  return route.path.startsWith('/film/') && item.value?.video
})

// 页面背景样式 - 使用与卡片相同的图片作为背景
const pageBgStyle = computed(() => {
  if (!item.value?.background) return {}
  
  const bg = item.value.background
  if (bg.startsWith('/')) {
    return { 
      backgroundImage: `linear-gradient(rgba(6, 8, 15, 0.75), rgba(6, 8, 15, 0.85)), url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }
  }
  return { background: bg }
})

const cardStyle = computed(() => {
  if (!item.value?.background) return {}
  
  const bg = item.value.background
  if (bg.startsWith('/')) {
    return { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return { background: bg }
})

const openVideo = () => {
  showVideo.value = true
}

const closeVideo = () => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
  showVideo.value = false
}
</script>

<style scoped>
.film-detail {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 40px 20px 100px;
  position: relative;
  overflow-y: auto;
}

/* 图片区域：占3/4 */
.image-section {
  flex: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  padding-top: 80px;
}

/* 卡片：屏幕正中心60% */
.detail-wrapper {
  width: 60vw;
  aspect-ratio: 16/9;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 180, 220, 0.1);
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(170, 140, 255, 0.15);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.detail-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 0 40px rgba(170, 140, 255, 0.25);
}

/* 播放覆盖层 */
.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detail-wrapper:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #6366f1;
  margin-bottom: 12px;
  transition: transform 0.3s ease;
}

.detail-wrapper:hover .play-icon {
  transform: scale(1.1);
}

.play-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  letter-spacing: 1px;
}

/* 视频播放器 */
.video-wrapper {
  width: 60vw;
  aspect-ratio: 16/9;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(170, 140, 255, 0.15);
}

.detail-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.close-video-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.close-video-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* 文字区域：占1/4 */
.detail-text {
  flex: 1;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

/* 返回按钮：固定在右下角 */
.module-button {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 999;
  padding: 12px 30px;
  border-radius: 999px;
  border: 1px solid rgba(255, 180, 220, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: 0.3s;
}
.module-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 文字样式 */
.detail-title {
  font-size: clamp(28px, 5vw, 42px);
  color: #fff;
  margin: 0 0 12px;
  text-shadow: 0 0 15px rgba(255, 170, 220, 0.4);
}

.detail-subtitle {
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(255, 200, 230, 0.9);
  margin: 0 0 30px;
}

.detail-content {
  font-size: clamp(14px, 1.5vw, 16px);
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin: 0;
}

.detail-content strong {
  color: rgba(255, 180, 220, 0.95);
  font-weight: 600;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .film-detail {
    padding: 20px 16px 80px;
  }
  
  .image-section {
    margin-bottom: 30px;
  }
  
  .detail-wrapper,
  .video-wrapper {
    width: 90vw;
  }
  
  .play-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
</style>
