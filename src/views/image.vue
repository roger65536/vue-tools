<template>
  <div class="image-page page-container">
    <div class="page-header">
      <h2>图片转换工具</h2>
      <p class="page-description">将WebP格式图片转换为PNG格式，支持批量转换</p>
    </div>
    
    <el-card class="convert-area card-shadow">
      <el-upload
        class="upload-area"
        drag
        action=""
        :auto-upload="false"
        :on-change="handleImageUpload"
        accept=".webp"
        :multiple="true"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽WebP文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持上传多个WebP格式文件
          </div>
        </template>
      </el-upload>

      <div v-if="convertedImages.length > 0" class="preview-area">
        <div class="preview-header">
          <h3>转换预览</h3>
          <el-button type="primary" @click="downloadAll" :icon="Download">
            批量下载
          </el-button>
        </div>

        <el-row :gutter="20">
          <el-col 
            v-for="(image, index) in convertedImages" 
            :key="index"
            :span="8"
          >
            <el-card class="image-card card-shadow">
              <div class="image-wrapper">
                <img :src="image.url" :alt="image.name" class="preview-image" />
              </div>
              <div class="image-actions">
                <el-tooltip :content="image.name" placement="top">
                  <span class="image-name">{{ image.name }}</span>
                </el-tooltip>
                <el-button 
                  type="primary" 
                  size="small"
                  @click="downloadImage(image)"
                  :icon="Download"
                >
                  下载
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Download } from '@element-plus/icons-vue'

const convertedImages = ref([])

// 处理图片上传和转换
const handleImageUpload = async (file) => {
  if (!file.raw.type.includes('webp')) {
    ElMessage.error('请上传WebP格式的图片')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      // 转换为PNG格式
      const pngUrl = canvas.toDataURL('image/png')
      convertedImages.value.push({
        name: file.name.replace('.webp', '.png'),
        url: pngUrl
      })
      
      ElMessage.success('图片转换成功')
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 下载单个图片
const downloadImage = (image) => {
  const link = document.createElement('a')
  link.download = image.name
  link.href = image.url
  link.click()
}

// 批量下载
const downloadAll = () => {
  convertedImages.value.forEach(image => {
    downloadImage(image)
  })
  ElMessage.success('开始下载所有图片')
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-description {
  color: var(--text-color-light);
  margin-top: -10px;
}

.convert-area {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.upload-area {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.preview-area {
  margin-top: 40px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.preview-header h3 {
  margin: 0;
}

.image-card {
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.image-card:hover {
  transform: translateY(-5px);
}

.image-wrapper {
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  display: block;
}

.image-actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-name {
  font-size: 14px;
  color: var(--text-color-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
  cursor: default;
}

.el-button {
  padding: 12px 24px;
  font-weight: 500;
}

.el-button [class*="el-icon"] + span {
  margin-left: 8px;
}

:deep(.el-upload-dragger) {
  padding: 30px;
}

:deep(.el-upload__tip) {
  margin-top: 12px;
  color: var(--text-color-light);
}
</style> 