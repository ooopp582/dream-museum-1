<template>
  <div class="profile-page">
    <section
      ref="heavenRoomRef"
      class="heaven-room"
      :class="{ open: isHeavenOpen }"
      aria-label="Heaven room"
    >
      <div class="sun-orb"></div>
      <div class="moon-orb"></div>
      <div class="cloud-layer cloud-layer-one"></div>
      <div class="cloud-layer cloud-layer-two"></div>
      <div class="cloud-layer cloud-layer-three"></div>

      <div
        v-for="item in heavenItems"
        :key="item.id"
        class="heaven-object"
        :class="item.type"
        :style="{ left: `${item.x}%`, top: `${item.y}%` }"
        @pointerdown="startDragHeavenItem($event, item)"
      >
        <span class="object-symbol">{{ item.symbol }}</span>
      </div>
    </section>

    <button
      class="heaven-arrow"
      :class="{ open: isHeavenOpen }"
      type="button"
      aria-label="Open heaven room"
      @click="toggleHeavenRoom"
    >
      <span></span>
    </button>

    <div ref="profileMainRef" class="profile-header">
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
            ref="nameInputRef"
            v-model="userName"
            class="username-input"
            @blur="isEditName = false"
            @keyup.enter="isEditName = false"
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

    <div class="content-area">
      <div class="empty-state">
        <div class="empty-icon">✦</div>
        <p>你还没有发布任何梦境笔记</p>
        <p class="empty-tip">点击右下角加号，记录你的第一个梦境吧</p>
      </div>
    </div>

    <button class="add-dream-btn" type="button" @click="showModal = true">+</button>

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
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const avatarUrl = ref('https://via.placeholder.com/100/1a1234/ffffff?text=梦')
const fileInput = ref(null)
const profileMainRef = ref(null)
const heavenRoomRef = ref(null)
const activeHeavenItem = ref(null)
const isHeavenOpen = ref(false)

const userName = ref('梦境造梦者')
const isEditName = ref(false)
const nameInputRef = ref(null)

const showModal = ref(false)
const newDream = ref({ title: '', description: '' })
const activeTab = ref('notes')

const heavenItems = ref([
  { id: 'sun', type: 'sun-piece', symbol: 'SUN', x: 18, y: 34 },
  { id: 'moon', type: 'moon-piece', symbol: 'MOON', x: 74, y: 24 },
  { id: 'cup', type: 'cup-piece', symbol: 'CUP', x: 31, y: 66 },
  { id: 'crystal', type: 'crystal-piece', symbol: 'CRYSTAL', x: 58, y: 55 },
  { id: 'angel', type: 'angel-piece', symbol: 'ANGEL', x: 78, y: 70 }
])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file || !file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = (readerEvent) => {
    avatarUrl.value = readerEvent.target.result
  }
  reader.readAsDataURL(file)
}

const toggleHeavenRoom = () => {
  isHeavenOpen.value = !isHeavenOpen.value
}

const startDragHeavenItem = (event, item) => {
  activeHeavenItem.value = item
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

const dragHeavenItem = (event) => {
  if (!isHeavenOpen.value || !activeHeavenItem.value || !heavenRoomRef.value) return

  const rect = heavenRoomRef.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  activeHeavenItem.value.x = Math.min(91, Math.max(7, x))
  activeHeavenItem.value.y = Math.min(82, Math.max(16, y))
}

const stopDragHeavenItem = () => {
  activeHeavenItem.value = null
}

watch(isEditName, (val) => {
  if (val) {
    setTimeout(() => {
      nameInputRef.value?.focus()
    }, 10)
  }
})

const submitDream = () => {
  showModal.value = false
  newDream.value = { title: '', description: '' }
}

onMounted(() => {
  profileMainRef.value?.scrollIntoView({ block: 'start' })
  window.addEventListener('pointermove', dragHeavenItem)
  window.addEventListener('pointerup', stopDragHeavenItem)
  window.addEventListener('pointercancel', stopDragHeavenItem)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', dragHeavenItem)
  window.removeEventListener('pointerup', stopDragHeavenItem)
  window.removeEventListener('pointercancel', stopDragHeavenItem)
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 92px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  overflow-x: hidden;
}

.heaven-room {
  position: fixed;
  inset: 0;
  z-index: 950;
  overflow: hidden;
  background:
    radial-gradient(circle at 22% 20%, rgba(255, 244, 196, 0.9), rgba(255, 244, 196, 0.16) 21%, transparent 34%),
    radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.18) 16%, transparent 28%),
    linear-gradient(180deg, #fff9e8 0%, #fffdf4 42%, #f4efe2 100%);
  box-shadow:
    inset 0 -40px 80px rgba(255, 246, 213, 0.75),
    0 24px 70px rgba(120, 92, 50, 0.18);
  isolation: isolate;
  pointer-events: none;
  transform: translateY(-104%);
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.heaven-room.open {
  pointer-events: auto;
  transform: translateY(0);
}

.sun-orb,
.moon-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.sun-orb {
  top: 74px;
  left: 92px;
  width: 126px;
  height: 126px;
  background: #fff1a6;
  box-shadow: 0 0 90px rgba(255, 210, 92, 0.86);
}

.moon-orb {
  top: 96px;
  right: 126px;
  width: 82px;
  height: 82px;
  background: #fffef7;
  box-shadow: 0 0 42px rgba(255, 255, 255, 0.78);
}

.moon-orb::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 24px;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #fff9e8;
}

.cloud-layer {
  position: absolute;
  left: 50%;
  width: 130%;
  transform: translateX(-50%);
  pointer-events: none;
}

.cloud-layer::before,
.cloud-layer::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 8% 52%, rgba(255, 255, 255, 0.95) 0 9%, transparent 10%),
    radial-gradient(ellipse at 22% 45%, rgba(255, 255, 255, 0.94) 0 13%, transparent 14%),
    radial-gradient(ellipse at 38% 55%, rgba(255, 255, 255, 0.96) 0 12%, transparent 13%),
    radial-gradient(ellipse at 55% 42%, rgba(255, 255, 255, 0.9) 0 15%, transparent 16%),
    radial-gradient(ellipse at 72% 54%, rgba(255, 255, 255, 0.94) 0 12%, transparent 13%),
    radial-gradient(ellipse at 90% 47%, rgba(255, 255, 255, 0.92) 0 10%, transparent 11%);
}

.cloud-layer-one {
  bottom: -30px;
  height: 230px;
  opacity: 0.98;
}

.cloud-layer-two {
  bottom: 112px;
  height: 190px;
  opacity: 0.7;
  filter: blur(1px);
}

.cloud-layer-three {
  bottom: 250px;
  height: 150px;
  opacity: 0.46;
  filter: blur(2px);
}

.heaven-object {
  position: absolute;
  z-index: 4;
  width: 104px;
  height: 104px;
  display: grid;
  place-items: center;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(160, 122, 62, 0.22);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.36);
  box-shadow: 0 16px 34px rgba(142, 106, 55, 0.16);
  color: #7f6332;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.heaven-object:active {
  cursor: grabbing;
}

.object-symbol {
  font-size: 12px;
  letter-spacing: 1.4px;
  font-weight: 700;
}

.sun-piece {
  border-radius: 50%;
  background: radial-gradient(circle, #fff6b8 0 38%, rgba(255, 215, 120, 0.38) 39% 100%);
}

.moon-piece {
  border-radius: 50%;
  background: radial-gradient(circle at 35% 38%, #fff 0 36%, rgba(230, 218, 190, 0.45) 37% 100%);
}

.cup-piece::before {
  content: '';
  position: absolute;
  top: 25px;
  width: 44px;
  height: 32px;
  border: 3px solid rgba(126, 96, 45, 0.7);
  border-top: 0;
  border-radius: 0 0 22px 22px;
}

.crystal-piece {
  clip-path: polygon(50% 5%, 84% 36%, 68% 92%, 32% 92%, 16% 36%);
  border-radius: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.82), rgba(210, 240, 255, 0.42));
}

.angel-piece::before,
.angel-piece::after {
  content: '';
  position: absolute;
  top: 34px;
  width: 32px;
  height: 44px;
  border-radius: 50% 50% 8px 50%;
  background: rgba(255, 255, 255, 0.72);
}

.angel-piece::before {
  left: 12px;
  transform: rotate(-22deg);
}

.angel-piece::after {
  right: 12px;
  transform: rotate(22deg) scaleX(-1);
}

.heaven-arrow {
  position: fixed;
  left: 22px;
  top: 112px;
  z-index: 1100;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background 0.2s ease;
}

.heaven-arrow:hover {
  background: rgba(255, 255, 255, 0.2);
}

.heaven-arrow span {
  width: 16px;
  height: 16px;
  border-top: 2px solid currentColor;
  border-left: 2px solid currentColor;
  transform: translateY(4px) rotate(45deg);
}

.heaven-room.open + .heaven-arrow span {
  transform: translateY(-4px) rotate(225deg);
}

.heaven-arrow.open {
  top: auto;
  bottom: 28px;
}

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
  .heaven-object {
    width: 84px;
    height: 84px;
  }
  .heaven-arrow {
    left: 14px;
    top: 96px;
    width: 46px;
    height: 46px;
  }

  .heaven-arrow.open {
    top: auto;
    bottom: 18px;
  }
  .profile-header { flex-direction: column; text-align: center; padding: 24px; }
  .stats { justify-content: center; }
  .add-dream-btn { right: 16px; bottom: 16px; width: 48px; height: 48px; font-size: 24px; }
}
</style>
