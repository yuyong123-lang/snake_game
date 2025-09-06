<template>
  <div class="score-board">
    <div class="level-info">
      <div class="level-header">
        <span class="level-text">第{{ currentLevel }}关</span>
        <span class="difficulty-badge" :class="difficultyClass">
          {{ difficultyIcon }} {{ difficultyName }}
        </span>
      </div>
      <div class="level-name">{{ currentLevelName }}</div>
    </div>
    
    <div class="score-section">
      <div class="score-item">
        <span class="label">总分数:</span>
        <span class="value">{{ score }}</span>
      </div>
      <div class="score-item">
        <span class="label">关卡分数:</span>
        <span class="value">{{ levelScore }}</span>
      </div>
      <div class="score-item">
        <span class="label">蛇身长度:</span>
        <span class="value">{{ snakeLength }}</span>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-label">关卡进度</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">{{ levelScore }} / {{ requiredScore }}</div>
    </div>

    <div class="status-indicator" :class="gameStatusClass">
      {{ statusText }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { GAME_STATUS, DIFFICULTY } from '../types/game.js'

export default {
  name: 'ScoreBoard',
  props: {
    score: {
      type: Number,
      required: true
    },
    levelScore: {
      type: Number,
      required: true
    },
    snakeLength: {
      type: Number,
      required: true
    },
    gameStatus: {
      type: String,
      required: true
    },
    currentLevel: {
      type: Number,
      required: true
    },
    currentLevelName: {
      type: String,
      required: true
    },
    difficultyName: {
      type: String,
      required: true
    },
    difficultyIcon: {
      type: String,
      required: true
    },
    currentDifficulty: {
      type: String,
      required: true
    },
    requiredScore: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const statusText = computed(() => {
      switch (props.gameStatus) {
        case GAME_STATUS.IDLE:
          return '按空格开始游戏'
        case GAME_STATUS.RUNNING:
          return '游戏进行中'
        case GAME_STATUS.PAUSED:
          return '游戏已暂停'
        case GAME_STATUS.LEVEL_COMPLETE:
          return '关卡完成！'
        case GAME_STATUS.GAME_OVER:
          return '游戏结束'
        default:
          return ''
      }
    })

    const gameStatusClass = computed(() => {
      return {
        'status-idle': props.gameStatus === GAME_STATUS.IDLE,
        'status-running': props.gameStatus === GAME_STATUS.RUNNING,
        'status-paused': props.gameStatus === GAME_STATUS.PAUSED,
        'status-level-complete': props.gameStatus === GAME_STATUS.LEVEL_COMPLETE,
        'status-game-over': props.gameStatus === GAME_STATUS.GAME_OVER
      }
    })

    const difficultyClass = computed(() => {
      return {
        'difficulty-easy': props.currentDifficulty === DIFFICULTY.EASY,
        'difficulty-medium': props.currentDifficulty === DIFFICULTY.MEDIUM,
        'difficulty-hard': props.currentDifficulty === DIFFICULTY.HARD,
        'difficulty-hell': props.currentDifficulty === DIFFICULTY.HELL
      }
    })

    const progressPercentage = computed(() => {
      return Math.min((props.levelScore / props.requiredScore) * 100, 100)
    })

    return {
      statusText,
      gameStatusClass,
      difficultyClass,
      progressPercentage
    }
  }
}
</script>

<style scoped>
.score-board {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 15px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 107, 53, 0.3);
  margin-bottom: 25px;
  min-width: 320px;
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.1);
}

.level-info {
  text-align: center;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.level-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6b35;
  text-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
}

.difficulty-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid;
}

.difficulty-easy {
  background: rgba(0, 200, 81, 0.2);
  color: #00c851;
  border-color: rgba(0, 200, 81, 0.5);
}

.difficulty-medium {
  background: rgba(247, 147, 30, 0.2);
  color: #f7931e;
  border-color: rgba(247, 147, 30, 0.5);
}

.difficulty-hard {
  background: rgba(255, 53, 71, 0.2);
  color: #ff3547;
  border-color: rgba(255, 53, 71, 0.5);
}

.difficulty-hell {
  background: rgba(139, 69, 19, 0.3);
  color: #8B4513;
  border-color: rgba(139, 69, 19, 0.6);
  animation: hellGlow 2s infinite;
}

.level-name {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
}

.score-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
}

.label {
  color: rgba(255, 255, 255, 0.8);
}

.value {
  color: #ff6b35;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
}

.status-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
}

.status-idle {
  background-color: rgba(52, 152, 219, 0.15);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.5);
}

.status-running {
  background-color: rgba(0, 200, 81, 0.15);
  color: #00c851;
  border: 1px solid rgba(0, 200, 81, 0.5);
  animation: pulse 2s infinite;
}

.status-paused {
  background-color: rgba(247, 147, 30, 0.15);
  color: #f7931e;
  border: 1px solid rgba(247, 147, 30, 0.5);
}

.status-level-complete {
  background-color: rgba(0, 200, 81, 0.15);
  color: #00c851;
  border: 1px solid rgba(0, 200, 81, 0.5);
  animation: celebrate 1s infinite;
}

.status-game-over {
  background-color: rgba(255, 53, 71, 0.15);
  color: #ff3547;
  border: 1px solid rgba(255, 53, 71, 0.5);
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: 600;
}

.progress-bar {
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 107, 53, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #f7931e);
  border-radius: 6px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
}

.progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

@keyframes hellGlow {
  0% { text-shadow: 0 0 5px rgba(139, 69, 19, 0.5); }
  50% { text-shadow: 0 0 15px rgba(255, 0, 0, 0.8); }
  100% { text-shadow: 0 0 5px rgba(139, 69, 19, 0.5); }
}

@keyframes celebrate {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

@media (max-width: 480px) {
  .score-board {
    min-width: 200px;
  }
  
  .score-item {
    font-size: 16px;
  }
}</style>