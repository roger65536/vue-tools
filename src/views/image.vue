<template>
  <div class="image-page page-container">
    <div class="page-header">
      <h2>图片转换工具</h2>
      <p class="page-description">支持WebP、HEIC格式转换为PNG或JPG格式，支持批量转换</p>
    </div>
    
    <el-card class="convert-area card-shadow">
      <div class="format-selector">
        <div class="format-item">
          <span class="format-label">源文件格式：</span>
          <el-select 
            v-model="sourceFormat"
            @change="handleSourceFormatChange"
            class="format-select"
            :disabled="isConverting"
          >
            <el-option
              v-for="item in sourceFormats"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="format-item">
          <span class="format-label">目标格式：</span>
          <el-select 
            v-model="targetFormat"
            @change="handleTargetFormatChange"
            class="format-select"
            :disabled="isConverting"
          >
            <el-option
              v-for="item in targetFormats"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <el-upload
        class="upload-area"
        drag
        action=""
        :auto-upload="false"
        :on-change="handleImageUpload"
        :accept="`.${sourceFormat}`"
        :multiple="true"
        :disabled="isConverting"
      >
        <div class="upload-content">
          <el-icon :class="isConverting ? 'el-icon--loading' : 'el-icon--upload'">
            <component :is="isConverting ? 'Loading' : 'UploadFilled'" />
          </el-icon>
          <div class="el-upload__text">
            {{ isConverting ? '正在转换图片...' : `拖拽${sourceFormat.toUpperCase()}文件到此处或点击上传` }}
          </div>
          <div v-if="!isConverting" class="el-upload__tip">
            支持上传多个{{ sourceFormat.toUpperCase() }}格式文件，将转换为{{ targetFormat.toUpperCase() }}格式
          </div>
        </div>
      </el-upload>

      <div v-if="convertedImages.length > 0" class="preview-area">
        <div class="preview-header">
          <h3>转换预览</h3>
          <div class="preview-actions">
            <el-button 
              type="danger" 
              @click="clearImages" 
              :icon="Delete"
              :disabled="isConverting"
            >
              清空列表
            </el-button>
            <el-button 
              type="primary" 
              @click="downloadAll" 
              :icon="Download"
              :disabled="isConverting"
            >
              批量下载
            </el-button>
          </div>
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
                  :disabled="isConverting"
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
import { UploadFilled, Download, Delete } from '@element-plus/icons-vue'
import libheif from 'libheif-js'

const convertedImages = ref([])
const sourceFormat = ref('webp')
const targetFormat = ref('png')
const isConverting = ref(false)

// 源文件格式选项
const sourceFormats = [
  { label: 'WebP', value: 'webp' },
  { label: 'HEIC/HEIF', value: 'heic' }
]

// 目标文件格式选项
const targetFormats = [
  { label: 'PNG', value: 'png' },
  { label: 'JPG', value: 'jpeg' }
]

// 处理图片上传和转换
const handleImageUpload = async (file) => {
  const fileExt = file.name.split('.').pop().toLowerCase()
  
  if (fileExt !== sourceFormat.value && !(sourceFormat.value === 'heic' && ['heic', 'heif'].includes(fileExt))) {
    ElMessage.error(`请上传${sourceFormat.value.toUpperCase()}格式的图片`)
    return
  }

  try {
    isConverting.value = true
    let imgBlob

    if (sourceFormat.value === 'heic') {
      // 处理HEIC格式
      try {
        // 将文件转换为 Uint8Array
        const arrayBuffer = await file.raw.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        // 初始化 HeifDecoder
        const decoder = new libheif.HeifDecoder()
        const data = decoder.decode(uint8Array)

        // 提取第一张图片
        const image = data[0]
        const width = image.get_width()
        const height = image.get_height()

        // 创建 canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d')
        const imageData = context.createImageData(width, height)

        // 在 canvas 上显示图片
        await new Promise((resolve, reject) => {
          image.display(imageData, (displayData) => {
            if (!displayData) {
              return reject(new Error('HEIF处理错误'))
            }
            resolve()
          })
        })
        context.putImageData(imageData, 0, 0)

        // 转换为指定格式的 Blob
        imgBlob = await new Promise(resolve => 
          canvas.toBlob(
            resolve, 
            `image/${targetFormat.value}`, 
            0.8
          )
        )
      } catch (heicError) {
        console.error('HEIC转换错误:', heicError)
        throw new Error('HEIC格式转换失败，请确保图片格式正确')
      }
    } else {
      // 处理WebP格式
      const reader = new FileReader()
      imgBlob = await new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            
            canvas.toBlob(
              resolve, 
              `image/${targetFormat.value}`,
              0.8
            )
          }
          img.onerror = () => reject(new Error('图片加载失败'))
          img.src = e.target.result
        }
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsDataURL(file.raw)
      })
    }

    if (!imgBlob) {
      throw new Error('转换后的图片数据无效')
    }

    // 转换为URL并计算大小
    const url = URL.createObjectURL(imgBlob)
    const size = formatFileSize(imgBlob.size)
    
    // 获取新的文件名
    const newFileName = file.name.replace(
      new RegExp(`\\.${fileExt}$`), 
      `.${targetFormat.value}`
    )
    
    convertedImages.value.push({
      name: newFileName,
      url,
      size,
      blob: imgBlob
    })
    
    ElMessage.success('图片转换成功')
  } catch (error) {
    console.error('转换失败:', error)
    ElMessage.error(error.message || '图片转换失败，请重试')
  } finally {
    isConverting.value = false
  }
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
  if (convertedImages.value.length === 0) {
    ElMessage.warning('没有可下载的图片')
    return
  }
  convertedImages.value.forEach(image => {
    downloadImage(image)
  })
  ElMessage.success('开始下载所有图片')
}

// 清空转换列表
const clearImages = () => {
  convertedImages.value.forEach(image => {
    URL.revokeObjectURL(image.url)
  })
  convertedImages.value = []
  ElMessage.success('已清空转换列表')
}

// 监听源格式变化
const handleSourceFormatChange = () => {
  clearImages()
}

// 监听目标格式变化
const handleTargetFormatChange = () => {
  clearImages()
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

.format-selector {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  justify-content: center;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.format-label {
  font-size: 15px;
  color: var(--text-color);
  white-space: nowrap;
}

.format-select {
  width: 120px;
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

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.el-icon--loading {
  font-size: 64px;
  color: var(--primary-color);
  animation: rotating 2s linear infinite;
}

.el-icon--upload {
  font-size: 64px;
  color: #94a3b8;
  margin: 0;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.preview-actions {
  display: flex;
  gap: 12px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .format-selector {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .format-item {
    justify-content: center;
  }

  .format-label {
    font-size: 14px;
  }

  .preview-actions {
    gap: 8px;
  }

  .preview-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .preview-header h3 {
    text-align: center;
  }

  .preview-actions {
    justify-content: center;
  }

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
  .format-selector {
    gap: 12px;
    margin-bottom: 16px;
  }

  .format-label {
    font-size: 13px;
  }

  .format-select {
    width: 100px;
  }

  .preview-actions {
    flex-direction: column;
    gap: 8px;
  }

  .el-button {
    width: 100%;
  }

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