<template>
  <div class="dreams-page">
    <section class="hero-card">
      <p class="label">PUBLIC DREAMS</p>
      <h1>大众梦境</h1>
      <p>这里展示其他用户分享的梦境片段。内容沿用电影馆条目，你可以收藏，也可以留下自己的梦境回声。</p>
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
  </div>
</template>

<script setup>
import { reactive } from 'vue'
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
}
</style>
