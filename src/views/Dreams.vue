<template>
  <div class="dreams-page">
    <section class="hero-card">
      <p class="label">PUBLIC DREAMS</p>
      <h1>大众梦境</h1>
      <p>在这里，你可以浏览其他人分享的梦境故事，留下你的共鸣和评论，参与到这个关于梦的公共空间中来。</p>
    </section>

    <section class="dream-grid" aria-label="大众梦境列表">
      <article v-for="dream in dreams" :key="dream.id" class="dream-card">
        <router-link :to="`/dreams/${dream.id}`" class="dream-visual-link">
          <div class="dream-visual" :style="getDreamStyle(dream)">
            <span>{{ dream.subtitle }}</span>
          </div>
        </router-link>

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
            <p v-for="(comment, idx) in dream.comments" :key="idx" class="comment">{{ comment }}</p>
          </div>

          <form class="comment-form" @submit.prevent="addComment(dream)">
            <input v-model="dream.draft" type="text" placeholder="留下你的留言" />
            <button type="submit">发送</button>
          </form>
        </div>
      </article>
    </section>

    <button class="add-dream-btn" @click="showModal = true">+</button>

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
import { dreamItems } from '../data/exhibits'

const authors = ['夜航者', '折叠钟表', '蓝色放映员', '醒来之前']
const starterComments = [
  ['像从一层梦醒进另一层梦。'],
  ['这个画面很适合做成展厅入口。'],
  ['时间感被拉长了，很有沉浸感。'],
  ['像一段正在发光的记忆。']
]

const dreams = reactive(
  dreamItems.map((item, index) => ({
    ...item,
    author: authors[index],
    likes: 128 + index * 37,
    collected: index === 1,
    comments: [...starterComments[index]],
    draft: ''
  }))
)

const getDreamStyle = (dream) => {
  const bg = dream.background
  if (bg && bg.startsWith('/')) {
    return { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return { background: bg }
}

const addComment = (dream) => {
  const text = dream.draft.trim()
  if (!text) return
  dream.comments.push(text)
  dream.draft = ''
}

const showModal = ref(false)
const newDream = ref({
  title: '',
  description: ''
})

const submitDream = () => {
  const dream = {
    id: Date.now(),
    title: newDream.value.title,
    description: newDream.value.description,
    author: '匿名造梦者',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    subtitle: '新梦境',
    likes: 0,
    collected: false,
    comments: [],
    draft: ''
  }
  dreams.unshift(dream)
  showModal.value = false
  newDream.value = { title: '', description: '' }
}
</script>

<style scoped>
.dreams-page {
  min-height: 100vh;
  padding: 116px 24px 56px;
  background-image:
    linear-gradient(rgba(6, 8, 15, 0.58), rgba(6, 8, 15, 0.72)),
    url('/src/assets/background.jpg');
  background-size: auto, cover;
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

.dream-visual-link {
  display: block;
  text-decoration: none;
}

.dream-visual {
  min-height: 380px;
  display: flex;
  align-items: flex-end;
  padding: 22px;
  transition: transform 0.3s ease;
}

.dream-visual-link:hover .dream-visual {
  transform: scale(1.02);
}

.dream-visual span {
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  letter-spacing: 1px;
}

.dream-body {
  padding: 24px;
}

.dream-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

h2 {
  margin: 4px 0 0;
  font-size: clamp(20px, 2.5vw, 28px);
  color: #ffffff;
}

.collect-btn {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition: 0.3s;
  font-size: 13px;
}

.collect-btn:hover {
  background: rgba(255, 255, 255, 0.16);
}

.collect-btn.active {
  background: rgba(170, 140, 255, 0.28);
  border-color: rgba(170, 140, 255, 0.5);
  color: #c4b5fd;
}

.dream-desc {
  margin: 0 0 16px;
  font-size: 15px;
  line-height: 1.7;
}

.meta-row {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
  font-size: 13px;
  opacity: 0.75;
}

.comments {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
  margin-bottom: 12px;
}

.comment {
  margin: 0 0 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.72);
}

.comment-form {
  display: flex;
  gap: 8px;
}

.comment-form input {
  flex: 1;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.comment-form input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.comment-form input:focus {
  border-color: rgba(170, 140, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.comment-form button {
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

.comment-form button:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.add-dream-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1px solid rgba(255, 180, 220, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 28px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: 0.3s;
  z-index: 100;
  line-height: 1;
}

.add-dream-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.08);
}

.dream-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-items: center;
  z-index: 200;
  backdrop-filter: blur(4px);
}

.dream-modal {
  width: min(520px, 92vw);
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.96), rgba(30, 30, 60, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(20px);
}

.dream-modal h3 {
  margin: 0 0 22px;
  color: #ffffff;
  font-size: 22px;
  text-align: center;
}

.dream-modal form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dream-modal input,
.dream-modal textarea {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

.dream-modal input::placeholder,
.dream-modal textarea::placeholder {
  color: rgba(255, 255, 255, 0.42);
}

.dream-modal input:focus,
.dream-modal textarea:focus {
  border-color: rgba(170, 140, 255, 0.55);
  background: rgba(255, 255, 255, 0.1);
}

.dream-modal textarea {
  min-height: 120px;
  resize: vertical;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.modal-buttons button {
  flex: 1;
  padding: 13px;
  border-radius: 999px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.modal-buttons button:first-child {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.82);
}

.modal-buttons button:first-child:hover {
  background: rgba(255, 255, 255, 0.12);
}

.modal-buttons button:last-child {
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.modal-buttons button:last-child:hover {
  opacity: 0.88;
}

@media (max-width: 768px) {
  .dreams-page {
    padding: 92px 16px 80px;
  }

  .hero-card {
    padding: 24px;
  }

  .dream-grid {
    grid-template-columns: 1fr;
  }

  .dream-visual {
    min-height: 280px;
  }

  .dream-body {
    padding: 18px;
  }

  .dream-heading {
    flex-direction: column;
    gap: 10px;
  }

  .collect-btn {
    align-self: flex-start;
  }
}
</style>
