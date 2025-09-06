<template>
  <div class="game-controls">
    <div class="button-group">
      <button 
        v-if="gameStatus === GAME_STATUS.IDLE || gameStatus === GAME_STATUS.GAME_OVER"
        @click="startGame"
        class="control-button start-button primary-action"
      >
        {{ gameStatus === GAME_STATUS.GAME_OVER ? '重新开始' : '开始游戏' }}
      </button>
      
      <button 
        v-if="gameStatus === GAME_STATUS.RUNNING"
        @click="pauseGame"
        class="control-button pause-button primary-action"
      >
        暂停
      </button>
      
      <div class="secondary-actions">
        <button 
          v-if="gameStatus === GAME_STATUS.PAUSED"
          @click="pauseGame"
          class="control-button resume-button"
        >
          继续
        </button>
        
        <button 
          @click="resetGame"
          class="control-button reset-button"
          :disabled="gameStatus === GAME_STATUS.IDLE"
        >
          重置
        </button>
        
        <button 
          @click="showLevelSelector"
          class="control-button level-button"
        >
          选择关卡
        </button>
      </div>
    </div>

    <div class="mobile-controls" v-if="isMobile">
      <div class="direction-pad">
        <button 
          @click="changeDirection(DIRECTIONS.UP)"
          class="direction-button up"
          :disabled="!isGameRunning"
        >
          ↑
        </button>
        <div class="horizontal-controls">
          <button 
            @click="changeDirection(DIRECTIONS.LEFT)"
            class="direction-button left"
            :disabled="!isGameRunning"
          >
            ←
          </button>
          <button 
            @click="changeDirection(DIRECTIONS.RIGHT)"
            class="direction-button right"
            :disabled="!isGameRunning"
          >
            →
          </button>
        </div>
        <button 
          @click="changeDirection(DIRECTIONS.DOWN)"
          class="direction-button down"
          :disabled="!isGameRunning"
        >
          ↓
        </button>
      </div>
    </div>

    <div class="instructions">
      <p v-if="!isMobile">使用 WASD 或方向键控制蛇的移动</p>
      <p>空格键：开始/暂停游戏</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { GAME_STATUS, DIRECTIONS } from '../types/game.js'

export default {
  name: 'GameControls',
  props: {
    gameStatus: {
      type: String,
      required: true
    },
    isGameRunning: {
      type: Boolean,
      required: true
    }
  },
  emits: ['start-game', 'pause-game', 'reset-game', 'change-direction', 'show-level-selector'],
  setup(props, { emit }) {
    const isMobile = ref(false)

    const checkIsMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    const startGame = () => {
      emit('start-game')
    }

    const pauseGame = () => {
      emit('pause-game')
    }

    const resetGame = () => {
      emit('reset-game')
    }

    const changeDirection = (direction) => {
      emit('change-direction', direction)
    }

    const showLevelSelector = () => {
      emit('show-level-selector')
    }

    onMounted(() => {
      checkIsMobile()
      window.addEventListener('resize', checkIsMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkIsMobile)
    })

    return {
      GAME_STATUS,
      DIRECTIONS,
      isMobile,
      startGame,
      pauseGame,
      resetGame,
      changeDirection,
      showLevelSelector
    }
  }
}
</script>

<style scoped>
.game-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.primary-action {
  width: 100%;
}

.secondary-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.control-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.primary-action.control-button {
  font-size: 16px;
  min-width: 150px;
}

.secondary-actions .control-button {
  min-width: 85px;
  padding: 10px 16px;
  font-size: 13px;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.pause-button {
  background: linear-gradient(135deg, #f7931e, #ff6b35);
  color: white;
  box-shadow: 0 4px 15px rgba(247, 147, 30, 0.3);
}

.pause-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff6b35, #e55a2b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(247, 147, 30, 0.4);
}

.resume-button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.resume-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2980b9, #1f4e79);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.reset-button {
  background: linear-gradient(135deg, #ff3547, #e02d3c);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 53, 71, 0.3);
}

.reset-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #e02d3c, #c02630);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 53, 71, 0.4);
}

.level-button {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
}

.level-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #8e44ad, #7d3c98);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(155, 89, 182, 0.4);
}

.mobile-controls {
  margin-top: 20px;
}

.direction-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.horizontal-controls {
  display: flex;
  gap: 60px;
}

.direction-button {
  width: 55px;
  height: 55px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e3a5f, #2d4a66);
  color: white;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(30, 58, 95, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.direction-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2d4a66, #3e5a76);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(30, 58, 95, 0.4);
}

.direction-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.instructions {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
}

.instructions p {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .control-button {
    min-width: 150px;
  }
}
</style>