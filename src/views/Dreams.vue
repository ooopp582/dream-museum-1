<template>
  <div class="dreams-page">
    <section class="hero-card">
      <p class="label">PUBLIC DREAMS</p>
      <h1>大众梦境</h1>
      <p>在这里，你可以浏览其他人分享的梦境故事，留下你的共鸣和评论，参与到这个关于梦的公共空间中来。</p>
    </section>

    <section class="dream-grid" aria-label="大众梦境列表">
      <article v-for="dream in dreams" :key="dream.id" class="dream-card">
        <div class="dream-visual" :style="{ background: dream.background }">
          <span>{{ dream.subtitle }}</span>
        </div>

        <div class="dream-body">
          <div class="dream-heading">
            <div>
              <p class="author">{{ dream.author }}</p>
              <h2>{{ dream.title }}</h2>
            </div>
            <button class="collect-btn" type="button" :class="{ active: dream.collected }" @click="dream.collected = !dream.collected">
              {{ dream.collected ? '已收藏' : '收藏' }}
            </button>
          </div>

          <p class="dream-desc">{{ dream.description }}</p>

          <div class="meta-row">
            <span>{{ dream.likes }} 次共鸣</span>
            <span>{{ dream.comments.length }} 条留言</span>
          </div>

          <div class="comments">
            <p v-for="comment in dream.comments" :key="comment" class="comment">{{ comment }}</p>
          </div>

          <form class="comment-form" @submit.prevent="addComment(dream)">
            <input v-model="dream.draft" type="text" placeholder="留下你的留言" />
            <button type="submit">发送</button>
          </form>
        </div>
      </article>
    </section>

    <!-- 👇 新增：右下角圆形加号按钮 -->
    <button class="add-dream-btn" @click="showModal = true">+</button>

    <!-- 👇 新增：梦境输入弹窗 -->
    <div class="dream-modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="dream-modal">
        <h3>分享你的梦境</h3>
        <form @submit.prevent="submitDream">
          <input v-model="newDream.title" placeholder="梦境标题" required />
          <textarea v-model="newDream.description" placeholder="描述你的梦境..." required></textarea>
          <div class="modal-buttons">
            <button type="button" @click="showModal = false">取消</button>
            <button type="submit">分享梦境</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { filmItems } from '../data/exhibits'

const authors = ['夜航者', '折叠钟表', '蓝色放映员', '醒来之前']
const starterComments = [
  ['像从一层梦醒进另一层梦。'],
  ['这个画面很适合做成展厅入口。'],
  ['时间感被拉长了，很有沉浸感。'],
  ['像一段正在发光的记忆。']
]

const dreams = reactive(
  filmItems.map((item, index) => ({
    ...item,
    author: authors[index],
    likes: 128 + index * 37,
    collected: index === 1,
    comments: [...starterComments[index]],
    draft: ''
  }))
)

const addComment = (dream) => {
  const text = dream.draft.trim()
  if (!text) return
  dream.comments.push(text)
  dream.draft = ''
}

// 👇 新增：控制弹窗显示/隐藏
const showModal = ref(false)
// 👇 新增：存储用户输入的梦境内容
const newDream = ref({
  title: '',
  description: ''
})

// 👇 新增：提交新梦境的函数
const submitDream = () => {
  const dream = {
    id: Date.now(), // 用时间戳生成唯一ID
    title: newDream.value.title,
    description: newDream.value.description,
    author: '匿名造梦者', // 可修改为用户名
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 默认背景色
    subtitle: '新梦境',
    likes: 0,
    collected: false,
    comments: [],
    draft: ''
  }
  // 把新梦境添加到列表最前面
  dreams.unshift(dream)
  // 关闭弹窗并清空输入
  showModal.value = false
  newDream.value = { title: '', description: '' }
}
</script>

<style scoped>
.dreams-page {
  min-height: 100vh;
  padding: 116px 24px 56px;
  background-image:
    linear-gradient(rgba(6, 8, 15, 0.42), rgba(6, 8, 15, 0.68)),
    url('/src/assets/background.jpg');
  background-size: auto, 100% 100%;
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center bottom;
}

.hero-card,
.dream-card {
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(16, 185, 129, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 22px 58px rgba(0, 0, 0, 0.26);
  backdrop-filter: blur(14px);
}

.hero-card {
  width: min(1080px, 100%);
  margin: 0 auto 24px;
  padding: 36px 40px;
}

.label,
.author {
  margin: 0;
  font-size: 12px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.72);
}

h1 {
  margin: 10px 0;
  font-size: clamp(32px, 5vw, 54px);
}

.hero-card p:last-child,
.dream-desc,
.comment,
.meta-row {
  color: rgba(255, 255, 255, 0.82);
}

.hero-card p:last-child {
  margin: 0;
  line-height: 1.8;
}

.dream-grid {
  width: min(1080px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.dream-card {
  overflow: hidden;
}

.dream-visual {
  min-height: 190px;
  display: flex;
  align-items: flex-end;
  padding: 22px;
}

.dream-visual span {
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

.dream-body {
  padding: 22px;
}

.dream-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

h2 {
  margin: 7px 0 0;
  font-size: clamp(24px, 3vw, 34px);
}

.collect-btn,
.comment-form button {
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.16);
  cursor: pointer;
}

.collect-btn {
  flex: 0 0 auto;
  padding: 8px 14px;
}

.collect-btn.active {
  background: rgba(59, 130, 246, 0.72);
}

.dream-desc {
  margin: 16px 0;
  line-height: 1.7;
}

.meta-row {
  display: flex;
  gap: 14px;
  font-size: 13px;
}

.comments {
  min-height: 44px;
  margin: 16px 0;
  display: grid;
  gap: 8px;
}

.comment {
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.comment-form {
  display: flex;
  gap: 10px;
}

.comment-form input {
  min-width: 0;
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  padding: 10px 14px;
  color: #ffffff;
  background: rgba(2, 6, 23, 0.34);
  outline: none;
}

.comment-form input::placeholder {
  color: rgba(255, 255, 255, 0.48);
}

.comment-form button {
  padding: 10px 16px;
}

/* 👇 新增：右下角加号按钮样式 */
.add-dream-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%; /* 强制圆形，确保宽高一致 */
  border: none;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 28px;
  /* 👇 核心居中代码 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  line-height: 1; /* 防止文本行高偏移 */
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

/* 👇 新增：弹窗遮罩层 */
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

/* 👇 新增：弹窗主体（磨砂玻璃风格） */
.dream-modal {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  padding: 32px;
  width: min(90%, 500px);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}

.dream-modal h3 {
  margin: 0 0 24px;
  color: white;
  font-size: 24px;
}

.dream-modal input,
.dream-modal textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: rgba(2, 6, 23, 0.34);
  color: white;
  font-size: 16px;
  outline: none;
}

.dream-modal textarea {
  min-height: 120px;
  resize: vertical;
}

.dream-modal input::placeholder,
.dream-modal textarea::placeholder {
  color: rgba(255, 255, 255, 0.48);
}

.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-buttons button {
  padding: 10px 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-buttons button:first-child {
  background: rgba(255, 255, 255, 0.16);
  color: white;
}

.modal-buttons button:last-child {
  background: rgba(59, 130, 246, 0.72);
  color: white;
}

.modal-buttons button:hover {
  transform: translateY(-2px);
}

@media (max-width: 820px) {
  .dreams-page {
    padding: 96px 12px 36px;
  }

  .hero-card {
    padding: 24px;
  }

  .dream-grid {
    grid-template-columns: 1fr;
  }

  /* 移动端适配按钮位置 */
  .add-dream-btn {
    right: 16px;
    bottom: 16px;
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
}
</style>
