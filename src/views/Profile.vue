<template>
  <div class="profile-page">
    <div class="card">
      <p class="label">PERSONAL CENTER</p>
      <h1>个人中心</h1>
      <p>这里可以扩展为收藏清单、浏览历史、观展笔记等功能。</p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding-top: 92px;
  display: grid;
  place-items: center;
}

.card {
  width: min(920px, calc(100vw - 48px));
  padding: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(16, 185, 129, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.label {
  margin: 0;
  font-size: 12px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.72);
}

h1 {
  margin: 10px 0;
  font-size: clamp(30px, 4.8vw, 48px);
}

p {
  margin: 0;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.84);
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 84px;
  }

  .card {
    width: calc(100vw - 24px);
    padding: 24px;
  }
}
</style>