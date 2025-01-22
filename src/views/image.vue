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

      <div class="preview-area">
        <div class="preview-header">
          <h3>转换预览</h3>
          <el-button type="primary" @click="downloadAll" :icon="Download">
            批量下载
          </el-button>
        </div>

        <div class="preview-list">
          <div 
            v-for="(image, index) in convertedImages" 
            :key="index"
            class="image-card card-shadow"
          >
            <div class="image-wrapper">
              <img :src="image.url" :alt="image.name" class="preview-image" />
            </div>
            <div class="image-info">
              <h4 class="image-name">{{ image.name }}</h4>
              <p class="image-size">{{ image.size }}</p>
              <div class="image-actions">
                <el-button 
                  type="primary" 
                  @click="downloadImage(image)"
                  :icon="Download"
                >
                  下载
                </el-button>
              </div>
            </div>
          </div>
        </div>
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
      
      // 计算文件大小
      const size = formatFileSize(Math.round(pngUrl.length * 0.75))
      
      convertedImages.value.push({
        name: file.name.replace('.webp', '.png'),
        url: pngUrl,
        size
      })
      
      ElMessage.success('图片转换成功')
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
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

.upload-area :deep(.el-upload) {
  width: 100%;
  display: block;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100% !important;
  height: 240px;
  padding: 32px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.upload-area :deep(.el-icon--upload) {
  font-size: 64px;
  color: #94a3b8;
  margin: 0;
}

.upload-area :deep(.el-upload__text) {
  font-size: 16px;
  color: var(--text-color-light);
}

.upload-area :deep(.el-upload__tip) {
  margin-top: 12px;
  color: var(--text-color-light);
  text-align: center;
}

.preview-area {
  margin-top: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.preview-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.image-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 24px;
}

.image-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.image-wrapper {
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.image-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-name {
  font-size: 15px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}

.image-size {
  font-size: 14px;
  color: var(--text-color-light);
  margin: 0;
}

.image-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.el-button {
  padding: 10px 24px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .image-card {
    padding: 12px;
    gap: 16px;
  }

  .image-wrapper {
    width: 120px;
    height: 120px;
  }

  .preview-image {
    padding: 8px;
  }

  .image-name {
    font-size: 14px;
  }

  .image-size {
    font-size: 13px;
  }

  .el-button {
    padding: 8px 20px;
    font-size: 14px;
  }

  .upload-area {
    max-width: 100%;
  }

  .upload-area :deep(.el-upload-dragger) {
    height: 180px;
    padding: 24px;
    gap: 12px;
  }

  .upload-area :deep(.el-icon--upload) {
    font-size: 48px;
  }

  .upload-area :deep(.el-upload__text) {
    font-size: 14px;
  }

  .upload-area :deep(.el-upload__tip) {
    font-size: 13px;
    margin-top: 8px;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 480px) {
  .image-card {
    padding: 10px;
    gap: 12px;
  }

  .image-wrapper {
    width: 100px;
    height: 100px;
  }

  .preview-image {
    padding: 6px;
  }

  .image-name {
    font-size: 13px;
  }

  .image-size {
    font-size: 12px;
  }

  .el-button {
    padding: 6px 16px;
    font-size: 13px;
  }

  .upload-area :deep(.el-upload-dragger) {
    height: 160px;
    padding: 20px;
    gap: 8px;
  }

  .upload-area :deep(.el-icon--upload) {
    font-size: 40px;
  }

  .upload-area :deep(.el-upload__text) {
    font-size: 13px;
  }

  .upload-area :deep(.el-upload__tip) {
    font-size: 12px;
    margin-top: 6px;
  }
}
</style> 