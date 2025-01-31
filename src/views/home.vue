<template>
  <div class="home">
    <h1>欢迎使用在线工具集合</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="tool-card" @click="$router.push('/qrcode')">
          <template #header>
            <div class="card-header">
              <h2>二维码工具</h2>
            </div>
          </template>
          <div class="card-content">
            <p>- 文本转二维码</p>
            <p>- 二维码解析</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="tool-card" @click="$router.push('/image')">
          <template #header>
            <div class="card-header">
              <h2>图片转换工具</h2>
            </div>
          </template>
          <div class="card-content">
            <p>- WebP转PNG</p>
            <p>- 批量转换</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="tool-card" @click="$router.push('/encrypt')">
          <template #header>
            <div class="card-header">
              <h2>加密工具</h2>
            </div>
          </template>
          <div class="card-content">
            <p>- MD5加密</p>
            <p>- SHA系列加密</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}

.el-row {
  margin: -10px;
}

.el-col {
  padding: 10px;
}

.tool-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
}

.card-content {
  color: #666;
  line-height: 1.8;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .home {
    padding: 15px;
  }

  .card-header h2 {
    font-size: 16px;
  }

  .card-content {
    font-size: 14px;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 480px) {
  .home {
    padding: 10px;
  }

  .card-header h2 {
    font-size: 15px;
  }

  .card-content {
    font-size: 13px;
  }
}
</style> 