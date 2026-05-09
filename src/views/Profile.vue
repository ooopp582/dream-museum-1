<template>
  <div class="profile-page">
    <!-- 用户信息区 -->
    <div class="profile-header">
      <!-- 点击头像上传 -->
      <div class="avatar" @click="triggerFileInput">
        <img :src="avatarUrl" alt="头像" />
      </div>
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        style="display: none" 
        @change="handleAvatarChange" 
      />

      <div class="profile-info">
        <!-- 点击用户名修改 -->
        <div class="username-wrap">
          <h2 
            v-if="!isEditName" 
            class="username" 
            @click="isEditName = true"
          >
            {{ userName }}
          </h2>
          <input
            v-else
            v-model="userName"
            class="username-input"
            @blur="isEditName = false"
            @keyup.enter="isEditName = false"
            ref="nameInputRef"
          />
        </div>

        <p class="bio">在梦境博物馆中，记录每一段奇幻的意识旅程。</p>
        <div class="stats">
          <span>12 关注</span>
          <span>3 粉丝</span>
          <span>8 次共鸣</span>
        </div>
      </div>
    </div>

    <!-- 标签栏 -->
    <div class="tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'notes' }" 
        @click="activeTab = 'notes'"
      >
        笔记
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'collections' }" 
        @click="activeTab = 'collections'"
      >
        收藏
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'likes' }" 
        @click="activeTab = 'likes'"
      >
        点赞
      </button>
    </div>

    <!-- 内容区 -->
    <div class="content-area">
      <div class="empty-state">
        <div class="empty-icon">🌙</div>
        <p>你还没有发布任何梦境笔记哦</p>
        <p class="empty-tip">点击右下角加号，记录你的第一个梦境吧</p>
      </div>
    </div>

    <!-- 加号按钮 -->
    <button class="add-dream-btn" @click="showModal = true">+</button>

    <!-- 记录梦境弹窗 -->
    <div class="dream-modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="dream-modal">
        <h3>记录你的梦境</h3>
        <form @submit.prevent="submitDream">
          <input v-model="newDream.title" placeholder="梦境标题" required />
          <textarea v-model="newDream.description" placeholder="描述你的梦境..." required></textarea>
          <div class="modal-buttons">
            <button type="button" @click="showModal = false">取消</button>
            <button type="submit">保存梦境</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 头像相关
const avatarUrl = ref('https://via.placeholder.com/100/1a1234/ffffff?text=梦')
const fileInput = ref(null)

// 用户名相关
const userName = ref('梦境造梦者')
const isEditName = ref(false)
const nameInputRef = ref(null)

// 弹窗
const showModal = ref(false)
const newDream = ref({ title: '', description: '' })

// 标签切换
const activeTab = ref('notes')

// 点击头像唤起文件
const triggerFileInput = () => {
  fileInput.value.click()
}
// 头像上传预览
const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = ev => {
    avatarUrl.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

// 改名自动聚焦
watch(isEditName, val => {
  if (val) {
    setTimeout(() => {
      nameInputRef.value?.focus()
    }, 10)
  }
})

// 提交梦境
const submitDream = () => {
  showModal.value = false
  newDream.value = { title: '', description: '' }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 92px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* 头像 */
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 180, 220, 0.2);
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  transition: 0.3s;
}
.avatar:hover {
  transform: scale(1.05);
  border-color: rgba(255, 180, 220, 0.4);
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-header {
  width: min(920px, 100%);
  padding: 32px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-info { flex: 1; }

.username {
  margin: 0 0 8px;
  font-size: 28px;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 170, 220, 0.3);
  cursor: pointer;
  display: inline-block;
}
.username:hover {
  text-decoration: underline;
}

/* 改名输入框 和文字样式完全一致 */
.username-input {
  font-size: 28px;
  color: #fff;
  background: transparent;
  border: none;
  outline: none;
  text-shadow: 0 0 10px rgba(255, 170, 220, 0.3);
  width: 100%;
  padding: 0;
}

.bio {
  margin: 0 0 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.72);
}
.stats {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.84);
}

.tabs {
  width: min(920px, 100%);
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.tab-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}
.tab-btn.active { color: #fff; }
.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: rgba(255, 170, 220, 0.8);
}

.content-area {
  width: min(920px, 100%);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
.empty-state {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-tip { font-size: 14px; color: rgba(255, 255, 255, 0.48); }

/* 加号按钮 */
.add-dream-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}
.add-dream-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

/* 弹窗 */
.dream-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.dream-modal {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  padding: 32px;
  width: min(90%, 500px);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}
.dream-modal h3 { margin: 0 0 24px; color: white; }
.dream-modal input,
.dream-modal textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: rgba(2, 6, 23, 0.34);
  color: white;
  outline: none;
}
.dream-modal textarea { min-height: 120px; resize: vertical; }
.modal-buttons { display: flex; gap: 12px; justify-content: flex-end; }
.modal-buttons button { padding: 10px 24px; border-radius: 999px; border: none; cursor: pointer; }
.modal-buttons button:first-child { background: rgba(255, 255, 255, 0.16); color: white; }
.modal-buttons button:last-child { background: rgba(59, 130, 246, 0.72); color: white; }

@media (max-width: 768px) {
  .profile-page { padding: 84px 12px 72px; }
  .profile-header { flex-direction: column; text-align: center; padding: 24px; }
  .stats { justify-content: center; }
  .add-dream-btn { right: 16px; bottom: 16px; width: 48px; height: 48px; font-size: 24px; }
}
</style>