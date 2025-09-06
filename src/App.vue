<template>
  <div id="app">
    <div class="game-container">
      <!-- 左侧信息区域 -->
      <div class="left-panel">
        <header class="game-header">
          <h1 class="game-title">🐍 贪吃蛇</h1>
          <ScoreBoard 
            :score="score"
            :level-score="levelScore"
            :snake-length="snake.length" 
            :game-status="gameStatus"
            :current-level="currentLevel"
            :current-level-name="currentLevelName"
            :difficulty-name="difficultyName"
            :difficulty-icon="difficultyIcon"
            :current-difficulty="currentDifficulty"
            :required-score="requiredScore"
          />
        </header>

        <div class="game-controls-section">
          <GameControls
            :game-status="gameStatus"
            :is-game-running="isGameRunning"
            @start-game="startGame"
            @pause-game="pauseGame"
            @reset-game="resetGame"
            @change-direction="changeDirection"
            @show-level-selector="showLevelSelector"
          />
        </div>
      </div>

      <!-- 右侧游戏区域 -->
      <div class="right-panel">
        <main class="game-main">
          <GameBoard 
            :snake="snake" 
            :food="food"
            :obstacles="obstacles"
          />
        </main>
      </div>
    </div>

    <!-- 关卡选择器 -->
    <LevelSelector
      :show="levelSelectorVisible"
      :current-level="currentLevel"
      :current-difficulty="currentDifficulty"
      :unlocked-levels="unlockedLevels"
      @close="hideLevelSelector"
      @start-game="handleLevelSelectorStart"
      @select-level="selectLevel"
      @select-difficulty="selectDifficulty"
    />

    <!-- 关卡完成遮罩 -->
    <div v-if="isLevelComplete" class="game-over-overlay">
      <div class="game-over-modal level-complete">
        <h2>🎉 关卡完成!</h2>
        <p>关卡: <span class="final-score">第{{ currentLevel }}关 - {{ currentLevelName }}</span></p>
        <p>难度: <span class="final-length">{{ difficultyIcon }} {{ difficultyName }}</span></p>
        <p>关卡分数: <span class="final-score">{{ levelScore }}</span></p>
        <p>总分数: <span class="final-score">{{ score }}</span></p>
        <div class="level-complete-message">
          <p v-if="currentLevel < MAX_LEVEL">🚀 即将进入下一关...</p>
          <p v-else>🏆 恭喜你完成了所有关卡！</p>
        </div>
      </div>
    </div>

    <!-- 游戏结束遮罩 -->
    <div v-if="isGameOver && !isLevelComplete" class="game-over-overlay">
      <div class="game-over-modal">
        <h2>💀 游戏结束!</h2>
        <p>关卡: <span class="final-level">第{{ currentLevel }}关 - {{ currentLevelName }}</span></p>
        <p>难度: <span class="final-difficulty">{{ difficultyIcon }} {{ difficultyName }}</span></p>
        <p>最终分数: <span class="final-score">{{ score }}</span></p>
        <p>蛇的长度: <span class="final-length">{{ snake.length }}</span></p>
        <div class="game-over-actions">
          <button @click="startGame" class="restart-button">
            🔄 重新开始
          </button>
          <button @click="showLevelSelector" class="level-select-button">
            🎯 选择关卡
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useSnakeGame } from './composables/useSnakeGame.js'
import { MAX_LEVEL } from './types/game.js'
import GameBoard from './components/GameBoard.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import GameControls from './components/GameControls.vue'
import LevelSelector from './components/LevelSelector.vue'

export default {
  name: 'App',
  components: {
    GameBoard,
    ScoreBoard,
    GameControls,
    LevelSelector
  },
  setup() {
    const {
      // 游戏基础状态
      gameStatus,
      score,
      snake,
      food,
      direction,
      
      // 关卡系统状态
      currentLevel,
      currentDifficulty,
      obstacles,
      unlockedLevels,
      levelScore,
      
      // 计算属性
      isGameRunning,
      isGameOver,
      isLevelComplete,
      currentGameSpeed,
      currentScoreMultiplier,
      requiredScore,
      currentLevelName,
      difficultyName,
      difficultyIcon,
      
      // 游戏控制方法
      startGame,
      pauseGame,
      resetGame,
      changeDirection,
      
      // 关卡系统方法
      selectLevel,
      selectDifficulty,
      nextLevel,
      completeLevel,
      saveProgress,
      loadProgress
    } = useSnakeGame()

    // 关卡选择器显示状态
    const levelSelectorVisible = ref(false)

    const showLevelSelector = () => {
      levelSelectorVisible.value = true
    }

    const hideLevelSelector = () => {
      levelSelectorVisible.value = false
    }

    const handleLevelSelectorStart = () => {
      hideLevelSelector()
      startGame()
    }

    return {
      // 游戏基础状态
      gameStatus,
      score,
      snake,
      food,
      direction,
      
      // 关卡系统状态
      currentLevel,
      currentDifficulty,
      obstacles,
      unlockedLevels,
      levelScore,
      
      // 计算属性
      isGameRunning,
      isGameOver,
      isLevelComplete,
      currentGameSpeed,
      currentScoreMultiplier,
      requiredScore,
      currentLevelName,
      difficultyName,
      difficultyIcon,
      
      // 游戏控制方法
      startGame,
      pauseGame,
      resetGame,
      changeDirection,
      
      // 关卡系统方法
      selectLevel,
      selectDifficulty,
      nextLevel,
      completeLevel,
      saveProgress,
      loadProgress,
      
      // 关卡选择器相关
      levelSelectorVisible,
      showLevelSelector,
      hideLevelSelector,
      handleLevelSelectorStart,
      
      // 常量
      MAX_LEVEL
    }
  }
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.game-container {
  display: flex;
  flex-direction: row;
  width: 66.67%; /* 2/3 of viewport width */
  height: 80vh;
  max-width: 1200px;
  background: rgba(248, 249, 250, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.left-panel {
  flex: 1;
  padding: 40px 30px;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.1) 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.right-panel {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(30, 58, 95, 0.1);
}

.game-header {
  text-align: center;
  margin-bottom: 30px;
}

.game-title {
  font-size: 2.8rem;
  margin-bottom: 30px;
  color: #ff6b35;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  letter-spacing: 2px;
}

.game-main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.game-controls-section {
  margin-top: auto;
}

.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 58, 95, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.game-over-modal {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  padding: 50px;
  border-radius: 25px;
  text-align: center;
  color: white;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
  animation: slideIn 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.game-over-modal h2 {
  font-size: 2.5rem;
  margin-bottom: 25px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.game-over-modal p {
  font-size: 1.3rem;
  margin-bottom: 18px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.final-score,
.final-length {
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.restart-button {
  margin-top: 25px;
  padding: 15px 30px;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.9);
  color: #ff6b35;
  border: 2px solid rgba(255, 255, 255, 1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
}

.restart-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.level-complete {
  background: linear-gradient(135deg, #00c851 0%, #00a037 100%);
  border: 2px solid rgba(0, 200, 81, 0.3);
}

.level-complete-message {
  margin-top: 20px;
  font-size: 1.1rem;
  font-style: italic;
}

.game-over-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
}

.level-select-button {
  padding: 15px 30px;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: 2px solid rgba(52, 152, 219, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
}

.level-select-button:hover {
  background: linear-gradient(135deg, #2980b9, #1f4e79);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.4);
}

.final-level,
.final-difficulty {
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0; 
    transform: translateY(-50px) scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

@media (max-width: 1024px) {
  .game-container {
    width: 85%;
    height: 85vh;
  }
  
  .left-panel {
    padding: 30px 20px;
  }
  
  .game-title {
    font-size: 2.4rem;
  }
}

@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    width: 95%;
    height: 95vh;
  }
  
  .left-panel {
    flex: none;
    height: auto;
    padding: 20px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .right-panel {
    flex: 1;
    padding: 15px;
  }
  
  .game-title {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .game-header {
    margin-bottom: 20px;
  }
  
  .game-over-modal {
    padding: 30px 25px;
    margin: 15px;
    border-radius: 20px;
  }
  
  .game-over-modal h2 {
    font-size: 2rem;
  }
  
  .game-over-modal p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .game-container {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }
  
  .left-panel {
    padding: 15px;
  }
  
  .right-panel {
    padding: 10px;
  }
  
  .game-title {
    font-size: 1.8rem;
  }
  
  .game-over-modal {
    padding: 25px 20px;
    margin: 10px;
  }
}
</style>