<template>
  <div class="home">
    <h1>欢迎使用在线工具集合</h1>
    <el-row :gutter="20">
      <el-col :span="12">
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
      <el-col :span="12">
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
    </el-row>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}

.tool-card {
  cursor: pointer;
  transition: all 0.3s;
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

.card-content {
  color: #666;
  line-height: 1.8;
}
</style> 