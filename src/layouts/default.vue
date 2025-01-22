<template>
  <el-container class="layout-container">
    <el-header class="header">
      <nav class="nav-container">
        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu" @click="toggleMenu">
          <el-icon><Menu /></el-icon>
        </div>

        <router-link to="/" class="logo">
          <el-icon class="logo-icon"><Tools /></el-icon>
          <span class="logo-text">在线工具集合</span>
        </router-link>

        <!-- 导航链接 -->
        <div class="nav-links" :class="{ 'nav-active': isMenuOpen }">
          <router-link to="/qrcode" class="nav-link" @click="closeMenu">
            <el-icon><Promotion /></el-icon>
            <span>二维码工具</span>
          </router-link>
          <router-link to="/image" class="nav-link" @click="closeMenu">
            <el-icon><Picture /></el-icon>
            <span>图片转换</span>
          </router-link>
        </div>
      </nav>
    </el-header>
    
    <!-- 遮罩层 -->
    <div 
      v-if="isMenuOpen" 
      class="overlay" 
      @click="closeMenu"
    ></div>
    
    <el-main class="main-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <el-footer class="footer">
      <p>© 2024 在线工具集合. All rights reserved.</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { ElContainer, ElHeader, ElMain, ElFooter } from 'element-plus'
import { Tools, Promotion, Picture, Menu } from '@element-plus/icons-vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: var(--background-color);
}

.header {
  background: linear-gradient(135deg, #409EFF 0%, #3178c6 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.nav-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.mobile-menu {
  display: none;
  font-size: 24px;
  cursor: pointer;
  margin-right: 15px;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.logo-icon {
  font-size: 24px;
}

.nav-links {
  margin-left: 40px;
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-container {
  padding: 80px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
}

.footer {
  background-color: #fff;
  color: var(--text-color-light);
  text-align: center;
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .mobile-menu {
    display: block;
  }

  .logo-text {
    font-size: 1.2em;
  }

  .nav-links {
    position: fixed;
    top: 60px;
    left: -100%;
    width: 70%;
    max-width: 300px;
    height: calc(100vh - 60px);
    background: white;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 20px 0;
    transition: left 0.3s ease;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }

  .nav-links.nav-active {
    left: 0;
  }

  .nav-link {
    color: var(--text-color);
    padding: 15px 20px;
    border-radius: 0;
    width: 100%;
  }

  .nav-link:hover {
    background-color: var(--background-color);
  }

  .overlay {
    display: block;
  }

  .main-container {
    padding: 70px 15px 15px;
  }

  .footer {
    padding: 15px;
    font-size: 0.9em;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 480px) {
  .logo-text {
    font-size: 1em;
  }

  .nav-links {
    width: 85%;
  }
}
</style> 