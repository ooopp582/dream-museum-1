<template>
  <div class="film-detail">
    <!-- 左侧文字：页面左下角，不遮挡卡片 -->
    <div class="detail-text">
      <h1 class="detail-title">INCEPTION</h1>
      <p class="detail-subtitle">梦境迷宫</p>
      <p class="detail-content">
        这部影片以梦境结构挑战观众的时间感。层层递进的空间与音效设计，让人像置身于意识展厅，逐层深入。
      </p>
    </div>

    <!-- 中间磨砂卡片：宽度60%，无按钮 -->
    <div class="detail-wrapper"></div>

    <!-- 🔥 返回按钮：固定在【整个页面右下角】 -->
    <button class="module-button" @click="$router.back()">返回</button>
  </div>
</template>

<script setup>

</script>

<style scoped>
.film-detail {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background: transparent;
  position: relative;
}

/* 左下角文字样式 */
.detail-text {
  position: absolute;
  left: 8%;
  bottom: 12%;
  max-width: 350px;
  text-align: left;
}

/* 卡片：60%网页宽度 */
.detail-wrapper {
  width: 50vw;
  aspect-ratio: 16/9;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 180, 220, 0.1);
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(170, 140, 255, 0.15);
}

/* 🔥 核心：按钮固定在【整个页面右下角】 */
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

/* 原有文字样式不变 */
.detail-title {
  font-size: 50px;
  color: #fff;
  margin: 0 0 10px;
  text-shadow: 0 0 15px rgba(255, 170, 220, 0.4);
}

.detail-subtitle {
  font-size: 20px;
  color: rgba(255, 200, 230, 0.9);
  margin: 0 0 30px;
}

.detail-content {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .detail-text {
    position: static;
    margin-bottom: 30px;
    text-align: center;
    max-width: 90%;
  }
  .film-detail {
    flex-direction: column;
    padding: 40px 20px;
  }
  .detail-wrapper {
    width: 90vw;
  }
}
</style>