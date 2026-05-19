<template>
  <nav class="navbar">
    <!-- 左侧Logo -->
    <router-link to="/" class="logo">梦境博物馆</router-link>

    <!-- 中间导航链接（左移到logo旁） -->
    <div class="links">
      <router-link to="/film" class="link">电影馆</router-link>
      <router-link to="/art" class="link">画作馆</router-link>
      <router-link to="/dreams" class="link">大众梦境</router-link>
      <router-link to="/profile" class="link">个人中心</router-link>
    </div>

    <!-- 右侧搜索框（放大镜已缩小嵌入） -->
    <div class="music-player" @click.stop>
      <audio
        ref="audioRef"
        :src="currentTrack.src"
        preload="metadata"
        @loadedmetadata="syncDuration"
        @timeupdate="syncTime"
        @ended="nextTrack"
      ></audio>

      <button class="music-icon-btn" type="button" aria-label="上一首" @click="previousTrack">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 5v14l-9-7 9-7Z"></path>
          <path d="M7 5h2v14H7z"></path>
        </svg>
      </button>

      <button class="music-play-btn" type="button" :aria-label="isPlaying ? '暂停音乐' : '播放音乐'" @click="togglePlay">
        <svg v-if="!isPlaying" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7L8 5Z"></path>
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 5h4v14H7z"></path>
          <path d="M13 5h4v14h-4z"></path>
        </svg>
      </button>

      <button class="music-icon-btn" type="button" aria-label="下一首" @click="nextTrack">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5v14l9-7-9-7Z"></path>
          <path d="M15 5h2v14h-2z"></path>
        </svg>
      </button>

      <div class="music-meta">
        <span class="music-title">{{ currentTrack.title }}</span>
        <input
          class="music-progress"
          type="range"
          min="0"
          :max="duration || 0"
          step="0.1"
          :value="currentTime"
          aria-label="音乐进度"
          @input="seekTrack"
        />
      </div>

      <span class="music-time">{{ formattedTime }}</span>

      <div class="music-volume">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4Z"></path>
          <path d="M16 8c1.2 1 1.8 2.3 1.8 4s-.6 3-1.8 4"></path>
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model.number="volume"
          aria-label="音乐音量"
          @input="setVolume"
        />
      </div>
    </div>

    <div class="search-container">
      <div class="search-box">
        <!-- 筛选下拉按钮 -->
        <button class="filter-btn" @click="showFilter = !showFilter">
          {{ searchType }}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <!-- 搜索输入框 -->
        <input 
          v-model="keyword"
          type="text"
          placeholder="搜索内容..."
          @keyup.enter="handleSearch"
        />

        <!-- 🔥 修改1：放大镜图标缩小为10x10，线条调细 -->
        <button class="search-btn" @click="handleSearch">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <!-- 筛选下拉菜单 -->
      <div class="filter-menu" v-if="showFilter" @click.stop>
        <div class="filter-item" @click="chooseType('全部', 'all')">全部</div>
        <div class="filter-item" @click="chooseType('电影', 'film')">电影</div>
        <div class="filter-item" @click="chooseType('画作', 'art')">画作</div>
        <div class="filter-item" @click="chooseType('梦境帖子', 'dream')">梦境帖子</div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, nextTick, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索数据
const keyword = ref('')
const searchType = ref('全部')
const showFilter = ref(false)
const audioRef = ref(null)
const trackIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.55)

const tracks = [
  { title: 'Dream Drift', src: '/src/assets/video-shaonianpai.mp4' },
  { title: 'Night Gallery', src: '/src/assets/video-heitiane.mp4' },
  { title: 'Inner Land', src: '/src/assets/video-neilu.mp4' },
  { title: 'Glass Room', src: '/src/assets/video-lifangti.mp4' }
]

const currentTrack = computed(() => tracks[trackIndex.value])

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainingSeconds}`
}

const formattedTime = computed(() => {
  const current = formatTime(currentTime.value)
  const total = duration.value ? formatTime(duration.value) : '0:00'
  return `${current}/${total}`
})

const playAudio = async () => {
  if (!audioRef.value) return

  try {
    await audioRef.value.play()
    isPlaying.value = true
  } catch {
    isPlaying.value = false
  }
}

const togglePlay = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    return
  }

  playAudio()
}

const switchTrack = (direction) => {
  const wasPlaying = isPlaying.value
  trackIndex.value = (trackIndex.value + direction + tracks.length) % tracks.length
  currentTime.value = 0
  duration.value = 0

  nextTick(() => {
    if (!audioRef.value) return

    audioRef.value.volume = volume.value
    audioRef.value.load()
    if (wasPlaying) {
      playAudio()
    }
  })
}

const previousTrack = () => {
  switchTrack(-1)
}

const nextTrack = () => {
  switchTrack(1)
}

const syncDuration = () => {
  duration.value = audioRef.value?.duration || 0
}

const syncTime = () => {
  currentTime.value = audioRef.value?.currentTime || 0
}

const seekTrack = (event) => {
  if (!audioRef.value) return

  const nextTime = Number(event.target.value)
  audioRef.value.currentTime = nextTime
  currentTime.value = nextTime
}

const setVolume = () => {
  if (!audioRef.value) return
  audioRef.value.volume = volume.value
}

// 选择筛选类型
const chooseType = (label, value) => {
  searchType.value = label
  showFilter.value = false
}

// 搜索逻辑
const handleSearch = () => {
  if (!keyword.value.trim()) return
  router.push(`/search?keyword=${keyword.value}&type=${searchType.value}`)
}

// 点击外部关闭下拉
const closeMenu = (e) => {
  if (!e.target.closest('.search-container')) {
    showFilter.value = false
  }
}

watch(volume, setVolume)

onMounted(() => {
  document.addEventListener('click', closeMenu)
  setVolume()
})
onUnmounted(() => document.removeEventListener('click', closeMenu))
</script>

<style scoped>
/* ====================== ✅ 核心修复：不遮挡 + 自适应 ====================== */
.navbar {
  /* 关键1：Fixed 改为 Sticky 粘性定位，不脱离文档流，永远不遮挡内容 */
  position: sticky;
  top: 0;
  /* 关键2：完整宽度 + 自动适配，不溢出屏幕 */
  width: 100%;
  box-sizing: border-box;
  z-index: 1000;

  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 36px;
  /* 关键3：小屏幕自动换行，不会挤变形 */
  flex-wrap: wrap;

  background: linear-gradient(
    to right, 
    rgba(30, 31, 70, 0.598),
    rgba(25, 6, 80, 0.555)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 0 10px rgba(255, 180, 220, 0.1),
    0 0 15px rgba(68, 7, 236, 0.1);
}

/* 搜索框自动靠右 */
.search-container {
  margin-left: auto;
  position: relative;
}

/* ====================== 原有样式保留 ====================== */
.logo {
  color: #f8fafc;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1.5px;
  white-space: nowrap;
}

.links {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.link {
  color: rgba(248, 250, 252, 0.78);
  font-size: 15px;
  letter-spacing: 0.8px;
  padding: 6px 8px;
  border-radius: 999px;
  transition: color 0.2s ease, background-color 0.2s ease;
  white-space: nowrap;
}

.link:hover,
.link.router-link-active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
}

/* ====================== 搜索框样式 ====================== */
.music-player {
  flex: 1 1 360px;
  max-width: 520px;
  min-width: 300px;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  border: none;
  border-radius: 0;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;
  outline: none;
}

.music-icon-btn,
.music-play-btn {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 0;
  color: rgba(255, 255, 255, 0.86);
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease, transform 0.2s ease;
}

.music-player .music-icon-btn,
.music-player .music-play-btn,
.music-player .music-icon-btn:hover,
.music-player .music-play-btn:hover,
.music-player .music-icon-btn:focus,
.music-player .music-play-btn:focus,
.music-player .music-icon-btn:active,
.music-player .music-play-btn:active {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  outline: 0 !important;
}

.music-play-btn {
  width: 24px;
  height: 24px;
  color: #fff;
  background: transparent;
}

.music-icon-btn:hover,
.music-play-btn:hover {
  color: #fff;
  transform: translateY(-1px);
}

.music-icon-btn svg,
.music-play-btn svg,
.music-volume svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1.7;
}

.music-meta {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 2px;
}

.music-title {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.82);
  font-size: 11px;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-progress,
.music-volume input {
  width: 100%;
  height: 2px;
  accent-color: #d8b4fe;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 0;
  appearance: none;
  -webkit-appearance: none;
  box-shadow: none;
  outline: none;
}

.music-progress::-webkit-slider-runnable-track,
.music-volume input::-webkit-slider-runnable-track {
  height: 1px;
  border: 0;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: none;
}

.music-progress::-webkit-slider-thumb,
.music-volume input::-webkit-slider-thumb {
  width: 6px;
  height: 6px;
  margin-top: -2.5px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  box-shadow: none;
  appearance: none;
  -webkit-appearance: none;
}

.music-progress::-moz-range-track,
.music-volume input::-moz-range-track {
  height: 1px;
  border: 0;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: none;
}

.music-progress::-moz-range-thumb,
.music-volume input::-moz-range-thumb {
  width: 6px;
  height: 6px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  box-shadow: none;
}

.music-time {
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.music-volume {
  width: 88px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.68);
}

.music-volume input {
  min-width: 0;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 180, 220, 0.2);
  border-radius: 999px;
  padding: 0 10px;
  height: 36px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: rgba(255, 180, 220, 0.4);
  box-shadow: 0 0 10px rgba(255, 180, 220, 0.15);
}

.filter-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px 0 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  height: 20px;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  padding: 0 8px;
  width: 140px;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  border-radius: 0;
  transition: color 0.2s ease;
}

.search-btn:hover {
  color: #fff;
}

.filter-menu {
  position: absolute;
  top: 44px;
  right: 0;
  min-width: 140px;
  background: linear-gradient(to right, rgba(30, 31, 70, 0.95), rgba(25, 6, 80, 0.95));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 180, 220, 0.2);
  border-radius: 12px;
  overflow: hidden;
  z-index: 1001;
}

.filter-item {
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.filter-item:hover {
  background: rgba(255, 180, 220, 0.15);
  color: #fff;
}

/* ====================== ✅ 完美响应式适配 ====================== */
@media (max-width: 768px) {
  .navbar {
    padding: 12px 16px;
    gap: 10px;
  }

  .logo {
    font-size: 16px;
  }

  .links {
    gap: 6px;
  }

  .link {
    font-size: 12px;
    padding: 4px 6px;
  }

  /* 小屏幕搜索框缩小，不隐藏 */
  .music-player {
    order: 3;
    flex-basis: 100%;
    max-width: none;
    min-width: 0;
  }

  .music-time,
  .music-volume {
    display: none;
  }

  .search-box input {
    width: 80px;
  }
}
</style>
