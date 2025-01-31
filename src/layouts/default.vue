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
          <router-link 
            v-for="nav in navLinks" 
            :key="nav.path"
            :to="nav.path" 
            class="nav-link"
            :class="{ 'active': isActive(nav.path) }"
            @click="closeMenu"
          >
            <el-icon><component :is="nav.icon" /></el-icon>
            <span>{{ nav.text }}</span>
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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElContainer, ElHeader, ElMain, ElFooter } from 'element-plus'
import { Tools, Promotion, Picture, Menu } from '@element-plus/icons-vue'

const route = useRoute()
const isMenuOpen = ref(false)

// 导航配置
const navLinks = [
  { path: '/qrcode', icon: 'Promotion', text: '二维码工具' },
  { path: '/image', icon: 'Picture', text: '图片转换' },
  { path: '/encrypt', icon: 'Lock', text: '加密工具' },
  { path: '/json', icon: 'Document', text: 'JSON工具' }
]

// 判断路由是否激活
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

// 监听路由变化
watch(route, () => {
  // 路由变化时关闭菜单
  closeMenu()
}, { deep: true })
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: var(--background-color);
}

.header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2),
              0 4px 5px 0 rgba(0,0,0,0.14),
              0 1px 10px 0 rgba(0,0,0,0.12);
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
  gap: 0;
  height: 100%;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  font-weight: 500;
  height: 100%;
  border-radius: 0;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.9);
  transform: scaleX(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  opacity: 0;
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.12);
}

.nav-link.active::after {
  transform: scaleX(1);
  opacity: 1;
}

.nav-link .el-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.main-container {
  padding: 80px 20px 20px;
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
    left: 0;
    width: 75%;
    height: calc(100vh - 60px);
    margin: 0;
    padding: 16px 0;
    background: #ffffff;
    flex-direction: column;
    gap: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    box-shadow: 0 8px 10px -5px rgba(0,0,0,0.2),
                0 16px 24px 2px rgba(0,0,0,0.14),
                0 6px 30px 5px rgba(0,0,0,0.12);
  }

  .nav-links.nav-active {
    transform: translateX(0);
  }

  .nav-link {
    color: var(--text-color);
    padding: 15px 20px 15px 24px;
    height: auto;
    border-left: 3px solid transparent;
    background: transparent;
    font-weight: normal;
  }

  .nav-link::after {
    display: none;
  }

  .nav-link:hover {
    background-color: #f5f7fa;
  }

  .nav-link.active {
    background-color: rgba(25, 118, 210, 0.08);
    border-left-color: #1976d2;
    color: #1976d2;
  }

  .nav-link:hover .el-icon,
  .nav-link.active .el-icon {
    transform: none;
  }

  .nav-link:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }

  .overlay {
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
  }

  .main-container {
    padding: 70px 12px 12px;
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

  .nav-link {
    padding: 12px 16px 12px 20px;
  }

  .nav-link .el-icon {
    font-size: 16px;
  }
}
</style> 