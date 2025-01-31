<template>
  <div class="encrypt-page page-container">
    <div class="page-header">
      <h2>加密工具</h2>
      <p class="page-description">支持MD5、SHA-1、SHA-256、SHA-512等多种加密算法</p>
    </div>

    <el-card class="tool-card card-shadow">
      <div class="encrypt-content">
        <!-- 输入区域 -->
        <div class="input-area">
          <el-form>
            <el-form-item>
              <el-input
                v-model="inputText"
                type="textarea"
                :rows="8"
                placeholder="请输入要加密的文本"
                @input="handleInput"
              />
            </el-form-item>
            <el-form-item>
              <div class="algorithm-selector">
                <span class="algorithm-label">加密算法：</span>
                <!-- 桌面端显示 -->
                <div class="desktop-selector">
                  <el-radio-group v-model="algorithm" @change="handleInput">
                    <el-radio-button value="md5">MD5</el-radio-button>
                    <el-radio-button value="sha1">SHA-1</el-radio-button>
                    <el-radio-button value="sha256">SHA-256</el-radio-button>
                    <el-radio-button value="sha512">SHA-512</el-radio-button>
                  </el-radio-group>
                </div>
                <!-- 移动端显示 -->
                <div class="mobile-selector">
                  <el-select v-model="algorithm" @change="handleInput" class="algorithm-select">
                    <el-option value="md5" label="MD5" />
                    <el-option value="sha1" label="SHA-1" />
                    <el-option value="sha256" label="SHA-256" />
                    <el-option value="sha512" label="SHA-512" />
                  </el-select>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!-- 结果区域 -->
        <div class="result-area">
          <div class="result-header">
            <h3>加密结果</h3>
            <el-button 
              type="primary" 
              @click="copyResult" 
              :icon="DocumentCopy"
              :disabled="!encryptedText"
            >
              复制结果
            </el-button>
          </div>
          
          <div class="result-content card-shadow">
            <template v-if="encryptedText">
              <div class="result-text">{{ encryptedText }}</div>
              <div class="result-info">
                <span class="length-info">长度：{{ encryptedText.length }} 字符</span>
                <span class="type-info">算法：{{ algorithmMap[algorithm] }}</span>
              </div>
            </template>
            <template v-else>
              <div class="placeholder">
                <el-icon class="placeholder-icon"><Lock /></el-icon>
                <p>输入文本后显示加密结果</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, Lock } from '@element-plus/icons-vue'
import CryptoJS from 'crypto-js'

const inputText = ref('')
const algorithm = ref('md5')
const encryptedText = ref('')

// 算法映射
const algorithmMap = {
  md5: 'MD5',
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha512: 'SHA-512'
}

// 处理输入变化
const handleInput = () => {
  if (!inputText.value) {
    encryptedText.value = ''
    return
  }

  try {
    switch (algorithm.value) {
      case 'md5':
        encryptedText.value = CryptoJS.MD5(inputText.value).toString()
        break
      case 'sha1':
        encryptedText.value = CryptoJS.SHA1(inputText.value).toString()
        break
      case 'sha256':
        encryptedText.value = CryptoJS.SHA256(inputText.value).toString()
        break
      case 'sha512':
        encryptedText.value = CryptoJS.SHA512(inputText.value).toString()
        break
    }
  } catch (error) {
    console.error('加密错误:', error)
    ElMessage.error('加密过程出错，请重试')
  }
}

// 复制结果
const copyResult = () => {
  if (!encryptedText.value) return
  
  navigator.clipboard.writeText(encryptedText.value)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}
</script>

<style scoped>
.encrypt-page {
  max-width: 1080px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-description {
  color: var(--text-color-light);
  margin-top: 8px;
  font-size: 16px;
}

.tool-card {
  border-radius: 16px;
  overflow: hidden;
}

.encrypt-content {
  padding: 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.input-area {
  width: 100%;
}

.input-area :deep(.el-textarea__inner) {
  font-size: 16px;
  line-height: 1.6;
  padding: 20px;
  border-radius: 12px;
  resize: none;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.input-area :deep(.el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

.input-area :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.algorithm-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.algorithm-label {
  font-size: 15px;
  color: var(--text-color);
  white-space: nowrap;
}

.result-area {
  width: 100%;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.result-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  min-height: 160px;
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
}

.result-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 15px;
  line-height: 1.6;
  word-break: break-all;
  color: var(--text-color);
  margin-bottom: 16px;
  width: 100%;
  overflow-wrap: break-word;
}

.result-info {
  display: flex;
  gap: 24px;
  color: var(--text-color-light);
  font-size: 14px;
}

.placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-color-light);
}

.placeholder-icon {
  font-size: 48px;
  opacity: 0.3;
}

.placeholder p {
  font-size: 14px;
  margin: 0;
}

.desktop-selector {
  display: block;
}

.mobile-selector {
  display: none;
}

.algorithm-select {
  width: 100%;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .encrypt-content {
    padding: 20px;
    gap: 24px;
  }

  .desktop-selector {
    display: none;
  }

  .mobile-selector {
    display: block;
    width: 150px;
  }

  .algorithm-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .algorithm-label {
    font-size: 14px;
  }

  :deep(.el-select) {
    width: 100%;
  }

  .result-content {
    width: 100%;
    padding: 20px;
  }

  .result-text {
    font-size: 14px;
  }

  .result-info {
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 480px) {
  .encrypt-content {
    padding: 16px;
    gap: 20px;
  }

  .input-area :deep(.el-textarea__inner) {
    padding: 16px;
    font-size: 14px;
  }

  .algorithm-label {
    font-size: 13px;
  }

  .result-content {
    padding: 16px;
    min-height: 120px;
  }

  .result-text {
    font-size: 13px;
  }

  .result-info {
    font-size: 12px;
  }

  .placeholder-icon {
    font-size: 40px;
  }

  .placeholder p {
    font-size: 13px;
  }
}
</style> 