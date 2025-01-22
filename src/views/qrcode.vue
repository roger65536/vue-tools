<template>
  <div class="qrcode-page page-container">
    <div class="page-header">
      <h2>二维码工具</h2>
      <p class="page-description">生成或解析二维码，支持多种格式</p>
    </div>

    <el-card class="tool-card card-shadow">
      <el-tabs v-model="activeTab" class="qr-tabs">
        <!-- 文本转二维码 -->
        <el-tab-pane label="文本转二维码" name="encode">
          <div class="tab-content">
            <div class="split-layout">
              <el-form class="qr-form">
                <el-form-item>
                  <el-input
                    v-model="textInput"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入要转换的文本"
                  />
                </el-form-item>
              </el-form>

              <div class="qr-preview">
                <div class="qr-code-wrapper card-shadow">
                  <template v-if="textInput">
                    <qrcode-vue :value="textInput" :size="240" level="H" />
                  </template>
                  <template v-else>
                    <div class="qr-placeholder">
                      <el-icon class="placeholder-icon"><Document /></el-icon>
                      <p>输入文本后生成二维码</p>
                    </div>
                  </template>
                </div>
                <el-button 
                  type="primary" 
                  @click="downloadQR" 
                  :icon="Download"
                  :disabled="!textInput"
                >
                  下载二维码
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 二维码解析 -->
        <el-tab-pane label="二维码解析" name="decode">
          <div class="tab-content">
            <div class="split-layout">
              <div class="qr-upload">
                <template v-if="uploadedImage">
                  <div class="preview-image-wrapper card-shadow">
                    <img :src="uploadedImage" alt="预览图片" class="preview-image" />
                  </div>
                  <el-button 
                    type="danger" 
                    @click="handleDeleteImage" 
                    :icon="Delete"
                    class="delete-button"
                  >
                    删除图片
                  </el-button>
                </template>
                <template v-else>
                  <el-upload
                    drag
                    action=""
                    :auto-upload="false"
                    :show-file-list="false"
                    accept="image/*"
                    :on-change="handleQRUpload"
                  >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                      拖拽图片到此处或 <em>点击上传</em>
                    </div>
                  </el-upload>
                </template>
              </div>

              <div class="decode-result">
                <div class="result-wrapper card-shadow">
                  <template v-if="decodedText">
                    <el-input
                      v-model="decodedText"
                      type="textarea"
                      :rows="6"
                      readonly
                    />
                  </template>
                  <template v-else>
                    <div class="qr-placeholder">
                      <el-icon class="placeholder-icon"><Document /></el-icon>
                      <p>上传二维码后显示解析结果</p>
                    </div>
                  </template>
                </div>
                <el-button 
                  type="primary" 
                  @click="copyText" 
                  :icon="DocumentCopy"
                  :disabled="!decodedText"
                >
                  复制文本
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import jsQR from 'jsqr'
import { ElMessage } from 'element-plus'
import { UploadFilled, Download, DocumentCopy, Document, Delete } from '@element-plus/icons-vue'

const activeTab = ref('encode')
const textInput = ref('')
const decodedText = ref('')
const uploadedImage = ref('')

// 下载二维码图片
const downloadQR = () => {
  const canvas = document.querySelector('canvas')
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvas.toDataURL()
  link.click()
}

// 处理二维码图片上传
const handleQRUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      
      if (code) {
        decodedText.value = code.data
        ElMessage.success('二维码解析成功')
      } else {
        ElMessage.error('未能识别二维码，请确保图片清晰')
      }
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 复制解析结果
const copyText = () => {
  navigator.clipboard.writeText(decodedText.value)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}

// 删除上传的图片
const handleDeleteImage = () => {
  uploadedImage.value = ''
  decodedText.value = ''
}
</script>

<style scoped>
.qrcode-page {
  padding: 20px;
  max-width: 1080px;
  margin: 0 auto;
  overflow-x: hidden;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-description {
  color: var(--text-color-light);
  margin-top: 8px;
  font-size: 16px;
}

.tool-card {
  min-height: 440px;
  overflow: hidden;
  border-radius: 16px;
}

.tab-content {
  padding: 20px 48px;
  min-height: 360px;
  overflow: hidden;
}

.split-layout {
  display: flex;
  gap: 48px;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  padding: 12px 0;
}

.qr-form {
  width: 420px;
  flex: none;
}

.qr-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.qr-form :deep(.el-textarea__inner) {
  font-size: 16px;
  line-height: 1.6;
  padding: 20px;
  border-radius: 12px;
  resize: none;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 320px;
}

.qr-form :deep(.el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

.qr-form :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.qr-preview {
  width: 420px;
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 0;
}

.qr-code-wrapper,
.result-wrapper {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 420px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-code-wrapper :deep(canvas) {
  max-width: 100%;
  max-height: 100%;
  width: auto !important;
  height: auto !important;
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-color-light);
  padding: 20px;
}

.placeholder-icon {
  font-size: 64px;
  opacity: 0.3;
}

.qr-placeholder p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.qr-upload {
  width: 420px;
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-upload :deep(.el-upload) {
  width: 100%;
  display: block;
}

.qr-upload :deep(.el-upload-dragger) {
  width: 420px !important;
  height: 240px;
  border-radius: 16px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
}

.qr-upload :deep(.el-upload-dragger:hover) {
  border-color: var(--primary-color);
}

.qr-upload :deep(.el-icon--upload) {
  font-size: 64px;
  margin: 0;
  color: #94a3b8;
}

.qr-upload :deep(.el-upload__text) {
  font-size: 16px;
  color: var(--text-color-light);
}

.qr-upload :deep(.el-upload__text em) {
  color: var(--primary-color);
  font-style: normal;
  font-weight: 500;
}

.qr-form :deep(.el-textarea__inner),
.decode-result :deep(.el-textarea__inner) {
  font-size: 16px;
  line-height: 1.6;
  padding: 24px 28px;
  border-radius: 16px;
  resize: none;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 240px;
  width: 100%;
}

.el-button {
  padding: 12px 32px;
  min-width: 140px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.decode-result {
  width: 420px;
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 0;
}

.result-wrapper {
  width: 420px;
  height: 240px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.decode-result .el-button {
  max-width: 320px;
  margin: 0;
}

.delete-button {
  margin: 0;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .qrcode-page {
    padding: 12px;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .page-description {
    font-size: 14px;
  }

  .tool-card {
    margin: 0;
    border-radius: 12px;
  }

  .tab-content {
    padding: 16px;
    min-height: auto;
  }

  .split-layout {
    flex-direction: column;
    gap: 20px;
    padding: 0;
    width: 100%;
  }

  .qr-form,
  .qr-preview,
  .qr-upload,
  .decode-result {
    width: 320px;
    flex: none;
    margin: 0 auto;
  }

  .qr-code-wrapper,
  .result-wrapper {
    width: 320px;
    height: 240px;
    padding: 20px;
  }

  .qr-form :deep(.el-textarea__inner),
  .decode-result :deep(.el-textarea__inner) {
    width: 100%;
    height: 240px;
    padding: 20px;
  }

  .qr-code-wrapper :deep(canvas) {
    max-width: 200px;
    max-height: 200px;
  }

  .placeholder-icon {
    font-size: 48px;
  }

  .qr-upload {
    width: 320px;
    gap: 16px;
  }

  .qr-upload :deep(.el-upload-dragger) {
    width: 320px !important;
    height: 180px;
    padding: 24px;
    gap: 12px;
    border-radius: 12px;
  }

  .qr-upload :deep(.el-icon--upload) {
    font-size: 48px;
  }

  .qr-upload :deep(.el-upload__text) {
    font-size: 14px;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0;
  }

  :deep(.el-tabs__nav) {
    width: 100%;
    display: flex;
  }

  :deep(.el-tabs__item) {
    flex: 1;
    text-align: center;
  }

  .qr-code-wrapper,
  .result-wrapper,
  .qr-upload :deep(.el-upload-dragger),
  .qr-form :deep(.el-textarea__inner),
  .decode-result :deep(.el-textarea__inner) {
    border-radius: 12px;
  }

  .el-button {
    padding: 10px 24px;
    min-width: 120px;
    font-size: 14px;
  }

  .decode-result {
    max-width: 320px;
    gap: 16px;
  }

  .decode-result .el-button {
    max-width: 280px;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 480px) {
  .qrcode-page {
    padding: 8px;
  }

  .tool-card {
    margin: 0;
    border-radius: 10px;
  }

  .tab-content {
    padding: 12px;
  }

  .qr-form,
  .qr-preview,
  .qr-upload,
  .decode-result {
    width: 280px;
  }

  .qr-code-wrapper,
  .result-wrapper {
    width: 280px;
    height: 200px;
    padding: 16px;
  }

  .qr-form :deep(.el-textarea__inner),
  .decode-result :deep(.el-textarea__inner) {
    width: 100%;
    height: 200px;
    padding: 16px;
  }

  .qr-code-wrapper :deep(canvas) {
    max-width: 168px;
    max-height: 168px;
  }

  .placeholder-icon,
  .qr-upload :deep(.el-icon--upload) {
    font-size: 40px;
  }

  .qr-upload {
    width: 280px;
    gap: 12px;
  }

  .qr-upload :deep(.el-upload-dragger) {
    width: 280px !important;
    height: 160px;
    padding: 20px;
    gap: 8px;
    border-radius: 10px;
  }

  .qr-upload :deep(.el-upload__text) {
    font-size: 13px;
  }

  .el-button {
    padding: 8px 20px;
    min-width: 100px;
  }

  .qr-code-wrapper,
  .result-wrapper,
  .qr-upload :deep(.el-upload-dragger),
  .qr-form :deep(.el-textarea__inner),
  .decode-result :deep(.el-textarea__inner) {
    border-radius: 10px;
  }

  .el-button {
    border-radius: 8px;
  }

  .decode-result {
    max-width: 280px;
    gap: 12px;
  }

  .decode-result .el-button {
    max-width: 240px;
  }
}

.preview-image-wrapper {
  width: 420px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: white;
  padding: 24px;
  border-radius: 16px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style> 