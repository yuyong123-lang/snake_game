<template>
  <div class="level-selector-overlay" v-if="show">
    <div class="level-selector-modal">
      <h2 class="modal-title">🎮 选择关卡挑战</h2>
      
      <!-- 区域说明 -->
      <div class="zones-section">
        <div class="zones-info">
          <div class="zone-item">
            <span class="zone-name">😊 新手区域</span>
            <span class="zone-levels">1-8关</span>
          </div>
          <div class="zone-item">
            <span class="zone-name">😐 进阶区域</span>
            <span class="zone-levels">9-16关</span>
          </div>
          <div class="zone-item">
            <span class="zone-name">😰 高难区域</span>
            <span class="zone-levels">17-24关</span>
          </div>
          <div class="zone-item">
            <span class="zone-name">💀 地狱区域</span>
            <span class="zone-levels">25-30关</span>
          </div>
        </div>
      </div>

      <!-- 关卡选择 -->
      <div class="level-section">
        <h3 class="section-title">选择关卡 (共 {{ MAX_LEVEL }} 关可选)</h3>
        <div class="level-grid">
          <button
            v-for="level in MAX_LEVEL"
            :key="level"
            @click="selectLevel(level)"
            class="level-button"
            :class="{ 
              'selected': selectedLevel === level,
              'available': true
            }"
:disabled="false"
          >
            <div class="level-number">{{ level }}</div>
            <div class="level-name">{{ LEVEL_CONFIG[level]?.name || '未知' }}</div>
            <div class="level-status">
              <span v-if="selectedLevel === level">🎯</span>
              <span v-else>🎮</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="modal-actions">
        <button @click="startGame" class="action-button start-button" :disabled="!canStart">
          🚀 开始游戏
        </button>
        <button @click="closeSelector" class="action-button cancel-button">
          ❌ 取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { DIFFICULTY_CONFIG, LEVEL_CONFIG, MAX_LEVEL, DIFFICULTY } from '../types/game.js'

export default {
  name: 'LevelSelector',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currentLevel: {
      type: Number,
      required: true
    },
    currentDifficulty: {
      type: String,
      required: true
    },
    unlockedLevels: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'start-game', 'select-level', 'select-difficulty'],
  setup(props, { emit }) {
    const selectedLevel = ref(props.currentLevel)
    const selectedDifficulty = ref(props.currentDifficulty)

    const canStart = computed(() => {
      return selectedLevel.value >= 1
    })

    const selectLevel = (level) => {
      selectedLevel.value = level
      emit('select-level', level)
    }

    const selectDifficulty = (difficulty) => {
      // 难度现在基于关卡自动确定，保留兼容性
      emit('select-difficulty', difficulty)
    }

    const startGame = () => {
      if (canStart.value) {
        emit('start-game')
      }
    }

    const closeSelector = () => {
      emit('close')
    }

    const getDifficultySpeed = (speed) => {
      if (speed >= 180) return '慢'
      if (speed >= 120) return '中'
      if (speed >= 80) return '快'
      return '极快'
    }

    return {
      DIFFICULTY_CONFIG,
      LEVEL_CONFIG,
      MAX_LEVEL,
      selectedLevel,
      selectedDifficulty,
      canStart,
      selectLevel,
      selectDifficulty,
      startGame,
      closeSelector,
      getDifficultySpeed
    }
  }
}
</script>

<style scoped>
.level-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 58, 95, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.level-selector-modal {
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 25px;
  padding: 30px;
  width: 95vw;
  height: 95vh;
  max-width: 1100px;
  max-height: 750px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 107, 53, 0.3);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #ff6b35;
  text-shadow: 0 4px 12px rgba(255, 107, 53, 0.5);
  flex-shrink: 0;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #fff;
  text-align: center;
  flex-shrink: 0;
}

.difficulty-section {
  margin-bottom: 25px;
  flex-shrink: 0;
}

.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.difficulty-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-align: center;
}

.difficulty-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.difficulty-button.selected {
  border-color: #ff6b35;
  background: rgba(255, 107, 53, 0.2);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
}

.difficulty-easy.selected { border-color: #00c851; background: rgba(0, 200, 81, 0.2); }
.difficulty-medium.selected { border-color: #f7931e; background: rgba(247, 147, 30, 0.2); }
.difficulty-hard.selected { border-color: #ff3547; background: rgba(255, 53, 71, 0.2); }
.difficulty-hell.selected { 
  border-color: #8B4513; 
  background: rgba(139, 69, 19, 0.3);
  animation: hellGlow 2s infinite;
}

.difficulty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 8px;
}

.difficulty-name {
  font-size: 1.2rem;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

.difficulty-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat {
  font-size: 0.85rem;
  opacity: 0.8;
}

.level-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin: -10px;
}

.level-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-align: center;
}

.level-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.level-button.selected {
  border-color: #ff6b35;
  background: rgba(255, 107, 53, 0.2);
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.3);
}

.level-button.available {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.level-button.available:hover {
  border-color: #ff6b35;
  background: rgba(255, 107, 53, 0.1);
}

.level-number {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.level-name {
  font-size: 0.9rem;
  margin-bottom: 8px;
  opacity: 0.9;
}

.level-status {
  font-size: 1.2rem;
}

.modal-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
  flex-shrink: 0;
}

.action-button {
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}

.start-button {
  background: linear-gradient(135deg, #00c851, #00a037);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 200, 81, 0.3);
}

.start-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #00a037, #007d2b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 200, 81, 0.4);
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-button {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.cancel-button:hover {
  background: linear-gradient(135deg, #5a6268, #495057);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes hellGlow {
  0% { box-shadow: 0 0 15px rgba(139, 69, 19, 0.3); }
  50% { box-shadow: 0 0 25px rgba(255, 0, 0, 0.6); }
  100% { box-shadow: 0 0 15px rgba(139, 69, 19, 0.3); }
}

@media (max-width: 768px) {
  .level-selector-modal {
    margin: 10px;
    padding: 20px;
  }
  
  .difficulty-grid {
    grid-template-columns: 1fr;
  }
  
  .level-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>