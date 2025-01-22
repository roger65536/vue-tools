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
          <el-form class="qr-form">
            <el-form-item>
              <el-input
                v-model="textInput"
                type="textarea"
                :rows="4"
                placeholder="请输入要转换的文本"
              />
            </el-form-item>
          </el-form>
          
          <div class="qr-preview" v-if="textInput">
            <div class="qr-code-wrapper card-shadow">
              <qrcode-vue :value="textInput" :size="200" level="H" />
            </div>
            <el-button type="primary" @click="downloadQR" class="download-btn" :icon="Download">
              下载二维码
            </el-button>
          </div>
        </el-tab-pane>
        
        <!-- 二维码解析 -->
        <el-tab-pane label="二维码解析" name="decode">
          <el-upload
            class="upload-area card-shadow"
            drag
            action=""
            :auto-upload="false"
            :on-change="handleQRUpload"
            accept="image/*"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽二维码图片到此处或 <em>点击上传</em>
            </div>
          </el-upload>
          
          <div v-if="decodedText" class="decoded-result">
            <h3>解析结果：</h3>
            <el-input
              type="textarea"
              v-model="decodedText"
              :rows="4"
              readonly
            />
            <el-button type="primary" @click="copyText" class="copy-btn" :icon="DocumentCopy">
              复制文本
            </el-button>
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
import { UploadFilled, Download, DocumentCopy } from '@element-plus/icons-vue'

const activeTab = ref('encode')
const textInput = ref('')
const decodedText = ref('')

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

.tool-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.qr-form {
  max-width: 600px;
  margin: 20px auto;
}

.qr-preview {
  margin-top: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-code-wrapper {
  background: white;
  padding: 20px;
  display: inline-block;
}

.upload-area {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  background: white;
}

.decoded-result {
  margin-top: 30px;
  max-width: 600px;
  margin: 20px auto;
}

.decoded-result h3 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.el-button {
  padding: 12px 24px;
  font-weight: 500;
}

.el-button [class*="el-icon"] + span {
  margin-left: 8px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  padding: 0 24px;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
}
</style> 