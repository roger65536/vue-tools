<template>
  <div class="json-page page-container">
    <div class="page-header">
      <h2>JSON工具</h2>
      <p class="page-description">支持JSON折叠展开和Unicode转义</p>
    </div>

    <el-card class="tool-card card-shadow">
      <div class="json-content">
        <!-- 输入区域 -->
        <div class="input-area">
          <div class="area-header">
            <h3>输入JSON</h3>
            <div class="header-actions">
              <el-button 
                @click="clearInput"
                :icon="Delete"
              >清空</el-button>
            </div>
          </div>
          <el-input
            v-model="inputJSON"
            type="textarea"
            :rows="12"
            placeholder="请输入JSON字符串"
            @input="handleInput"
          />
        </div>

        <!-- 结果区域 -->
        <div class="result-area">
          <div class="area-header">
            <h3>处理结果</h3>
            <div class="header-actions">
              <el-button-group class="view-actions">
                <el-button 
                  @click="expandAll"
                  :disabled="!formattedJSON"
                >展开</el-button>
                <el-button 
                  @click="collapseAll"
                  :disabled="!formattedJSON"
                >折叠</el-button>
              </el-button-group>
              <el-button-group class="unicode-actions">
                <el-button 
                  @click="unicodeToChinese"
                  :disabled="!formattedJSON"
                >Unicode转中文</el-button>
                <el-button 
                  @click="chineseToUnicode"
                  :disabled="!formattedJSON"
                >中文转Unicode</el-button>
              </el-button-group>
              <el-button 
                type="primary" 
                @click="copyResult"
                :icon="DocumentCopy"
                :disabled="!formattedJSON"
              >复制结果</el-button>
            </div>
          </div>
          <div class="json-viewer card-shadow" ref="jsonViewer">
            <template v-if="formattedJSON">
              <pre><code v-html="highlightedJSON"></code></pre>
            </template>
            <template v-else>
              <div class="placeholder">
                <el-icon class="placeholder-icon"><Document /></el-icon>
                <p>输入JSON后显示处理结果</p>
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
import { Document, DocumentCopy, Delete } from '@element-plus/icons-vue'

const inputJSON = ref('')
const formattedJSON = ref('')
const jsonViewer = ref(null)

// 处理输入变化
const handleInput = () => {
  if (!inputJSON.value) {
    formattedJSON.value = ''
    return
  }
  try {
    const obj = JSON.parse(inputJSON.value)
    formattedJSON.value = JSON.stringify(obj, null, 2)
  } catch (error) {
    ElMessage.error('JSON格式错误，请检查输入')
  }
}

// 高亮JSON的key和值
const highlightedJSON = computed(() => {
  if (!formattedJSON.value) return ''
  
  return formattedJSON.value
    // 高亮 key
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>')
    // 高亮字符串值
    .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
    // 高亮数字
    .replace(/: (-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
    // 高亮布尔值
    .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
    // 高亮 null
    .replace(/: (null)/g, ': <span class="json-null">$1</span>')
})

// 清空输入
const clearInput = () => {
  inputJSON.value = ''
  formattedJSON.value = ''
}

// 复制结果
const copyResult = () => {
  if (!formattedJSON.value) return
  
  navigator.clipboard.writeText(formattedJSON.value)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}

// Unicode转中文
const unicodeToChinese = () => {
  try {
    formattedJSON.value = formattedJSON.value.replace(/\\u[\dA-F]{4}/gi, match => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
    ElMessage.success('Unicode转换成功')
  } catch (error) {
    ElMessage.error('转换失败，请检查输入')
  }
}

// 中文转Unicode
const chineseToUnicode = () => {
  try {
    formattedJSON.value = formattedJSON.value.replace(/[\u4e00-\u9fa5]/g, str => {
      return '\\u' + str.charCodeAt(0).toString(16).padStart(4, '0')
    })
    ElMessage.success('Unicode转换成功')
  } catch (error) {
    ElMessage.error('转换失败，请检查输入')
  }
}

// 全部展开
const expandAll = () => {
  try {
    const obj = JSON.parse(formattedJSON.value)
    formattedJSON.value = JSON.stringify(obj, null, 2)
    ElMessage.success('展开成功')
  } catch (error) {
    ElMessage.error('操作失败，请检查JSON格式')
  }
}

// 全部折叠
const collapseAll = () => {
  try {
    const obj = JSON.parse(formattedJSON.value)
    formattedJSON.value = JSON.stringify(obj)
    ElMessage.success('折叠成功')
  } catch (error) {
    ElMessage.error('操作失败，请检查JSON格式')
  }
}
</script>

<style scoped>
.json-page {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}

.page-description {
  color: var(--text-color-light);
  margin-top: 8px;
  font-size: 16px;
}

.tool-card {
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.json-content {
  padding: 24px 48px;
  display: flex;
  gap: 32px;
  flex: 1;
  height: 100%;
}

.input-area,
.result-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.input-area :deep(.el-textarea) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-area :deep(.el-textarea__inner) {
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 20px;
  border-radius: 12px;
  resize: none;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100% !important;
  min-height: 500px;
}

.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.area-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.input-area :deep(.el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

.input-area :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.json-viewer {
  background: white;
  padding: 24px;
  border-radius: 12px;
  flex: 1;
  width: 100%;
  overflow-x: auto;
  min-height: 500px;
}

.json-viewer pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color);
}

.json-viewer code {
  white-space: pre-wrap;
  word-break: break-all;
}

.json-viewer :deep(.json-key) {
  color: #e96900;
  font-weight: 500;
}

.json-viewer :deep(.json-string) {
  color: #42b983;
}

.json-viewer :deep(.json-number) {
  color: #2f97ee;
}

.json-viewer :deep(.json-boolean) {
  color: #f08d49;
}

.json-viewer :deep(.json-null) {
  color: #e06c75;
}

.placeholder {
  height: 100%;
  min-height: 200px;
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

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .json-page {
    padding: 0 12px;
  }

  .tool-card {
    min-height: auto;
  }

  .json-content {
    padding: 20px;
    flex-direction: column;
    gap: 24px;
  }

  .input-area :deep(.el-textarea__inner),
  .json-viewer {
    min-height: 300px;
  }

  .area-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }

  .view-actions,
  .unicode-actions {
    flex: 1;
    display: flex;
  }

  .view-actions :deep(.el-button),
  .unicode-actions :deep(.el-button) {
    flex: 1;
    padding: 8px 12px;
  }

  :deep(.el-button) {
    font-size: 13px;
  }

  .input-area :deep(.el-textarea__inner) {
    padding: 16px;
    font-size: 13px;
  }

  .json-viewer {
    padding: 16px;
  }

  .json-viewer pre {
    font-size: 13px;
  }

  .placeholder-icon {
    font-size: 40px;
  }

  .placeholder p {
    font-size: 13px;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 480px) {
  .json-content {
    padding: 16px;
    gap: 20px;
  }

  .area-header h3 {
    font-size: 16px;
  }

  .header-actions {
    gap: 6px;
  }

  .input-area :deep(.el-textarea__inner) {
    padding: 12px;
    font-size: 12px;
  }

  .json-viewer {
    padding: 12px;
  }

  .json-viewer pre {
    font-size: 12px;
  }

  .placeholder-icon {
    font-size: 32px;
  }

  .placeholder p {
    font-size: 12px;
  }

  :deep(.el-button) {
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style> 