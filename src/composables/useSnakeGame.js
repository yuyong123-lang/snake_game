import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { 
  DIRECTIONS, 
  GAME_STATUS, 
  GRID_SIZE, 
  INITIAL_SNAKE_LENGTH, 
  DIFFICULTY, 
  DIFFICULTY_CONFIG, 
  MAX_LEVEL, 
  LEVEL_CONFIG,
  getLevelZone,
  getLevelSpeed
} from '../types/game.js'

export function useSnakeGame() {
  const gameStatus = ref(GAME_STATUS.IDLE)
  const score = ref(0)
  const snake = reactive([])
  const food = reactive({ x: 0, y: 0 })
  const direction = ref(DIRECTIONS.RIGHT)
  const nextDirection = ref(DIRECTIONS.RIGHT)
  
  // 新增关卡系统状态
  const currentLevel = ref(1)
  const currentDifficulty = ref(DIFFICULTY.EASY)
  const obstacles = reactive([])
  const unlockedLevels = ref(1)
  const levelScore = ref(0) // 当前关卡得分
  
  let gameLoop = null

  // 计算属性
  const isGameRunning = computed(() => gameStatus.value === GAME_STATUS.RUNNING)
  const isGameOver = computed(() => gameStatus.value === GAME_STATUS.GAME_OVER)
  const isLevelComplete = computed(() => gameStatus.value === GAME_STATUS.LEVEL_COMPLETE)
  
  // 使用基于关卡的速度系统
  const currentGameSpeed = computed(() => getLevelSpeed(currentLevel.value))
  const currentZone = computed(() => getLevelZone(currentLevel.value))
  const currentScoreMultiplier = computed(() => DIFFICULTY_CONFIG[currentZone.value.difficulty].scoreMultiplier)
  const requiredScore = computed(() => DIFFICULTY_CONFIG[currentZone.value.difficulty].requiredScore)
  
  const currentLevelName = computed(() => LEVEL_CONFIG[currentLevel.value]?.name || '未知关卡')
  const difficultyName = computed(() => `${currentZone.value.name} - ${DIFFICULTY_CONFIG[currentZone.value.difficulty].name}`)
  const difficultyIcon = computed(() => DIFFICULTY_CONFIG[currentZone.value.difficulty].icon)

  // 初始化蛇的位置
  const initializeSnake = () => {
    snake.length = 0
    
    // 寻找安全的生成位置，避免在障碍物上生成
    let startX, startY
    let attempts = 0
    const maxAttempts = 100
    
    do {
      startX = Math.floor(Math.random() * (GRID_SIZE - 6)) + 3 // 确保有足够空间
      startY = Math.floor(Math.random() * (GRID_SIZE - 6)) + 3
      attempts++
    } while (
      attempts < maxAttempts && 
      (isAreaOccupied(startX, startY, INITIAL_SNAKE_LENGTH, 1) ||
       obstacles.some(obstacle => 
         Math.abs(obstacle.x - startX) <= 2 && Math.abs(obstacle.y - startY) <= 2
       ))
    )
    
    // 如果找不到安全位置，使用默认中心位置
    if (attempts >= maxAttempts) {
      startX = Math.floor(GRID_SIZE / 2)
      startY = Math.floor(GRID_SIZE / 2)
    }
    
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      snake.push({ x: startX - i, y: startY })
    }
  }

  // 检查区域是否被占用
  const isAreaOccupied = (x, y, width, height) => {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const checkX = x - i
        const checkY = y + j
        if (obstacles.some(obstacle => obstacle.x === checkX && obstacle.y === checkY)) {
          return true
        }
      }
    }
    return false
  }

  // 初始化障碍物
  const initializeObstacles = () => {
    obstacles.length = 0
    const levelObstacles = LEVEL_CONFIG[currentLevel.value]?.obstacles || []
    levelObstacles.forEach(obstacle => {
      obstacles.push({ ...obstacle })
    })
  }

  // 生成食物位置
  const generateFood = () => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
      obstacles.some(obstacle => obstacle.x === newFood.x && obstacle.y === newFood.y)
    )
    
    food.x = newFood.x
    food.y = newFood.y
  }

  // 移动蛇
  const moveSnake = () => {
    direction.value = nextDirection.value
    const head = { ...snake[0] }

    switch (direction.value) {
      case DIRECTIONS.UP:
        head.y -= 1
        break
      case DIRECTIONS.DOWN:
        head.y += 1
        break
      case DIRECTIONS.LEFT:
        head.x -= 1
        break
      case DIRECTIONS.RIGHT:
        head.x += 1
        break
    }

    snake.unshift(head)

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
      const baseScore = 10
      const finalScore = Math.floor(baseScore * currentScoreMultiplier.value)
      score.value += finalScore
      levelScore.value += finalScore
      generateFood()
      
      // 检查是否完成关卡
      if (levelScore.value >= requiredScore.value) {
        completeLevel()
        return
      }
    } else {
      snake.pop()
    }
  }

  // 碰撞检测
  const checkCollision = () => {
    const head = snake[0]
    
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }

    // 检查自身碰撞
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true
      }
    }

    // 检查障碍物碰撞
    if (obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
      return true
    }

    return false
  }

  // 改变方向
  const changeDirection = (newDirection) => {
    if (gameStatus.value !== GAME_STATUS.RUNNING) return

    // 防止反向移动
    const oppositeDirections = {
      [DIRECTIONS.UP]: DIRECTIONS.DOWN,
      [DIRECTIONS.DOWN]: DIRECTIONS.UP,
      [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
      [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT
    }

    if (newDirection !== oppositeDirections[direction.value]) {
      nextDirection.value = newDirection
    }
  }

  // 游戏主循环
  const gameStep = () => {
    if (gameStatus.value !== GAME_STATUS.RUNNING) return

    moveSnake()

    if (checkCollision()) {
      gameOver()
      return
    }
  }

  // 完成关卡
  const completeLevel = () => {
    gameStatus.value = GAME_STATUS.LEVEL_COMPLETE
    clearInterval(gameLoop)
    
    // 保存进度
    saveProgress()
    
    setTimeout(() => {
      if (currentLevel.value < MAX_LEVEL) {
        nextLevel()
      } else {
        // 游戏全部通关
        gameStatus.value = GAME_STATUS.GAME_OVER
      }
    }, 2000)
  }

  // 进入下一关
  const nextLevel = () => {
    if (currentLevel.value >= MAX_LEVEL) return
    
    currentLevel.value++
    levelScore.value = 0
    initializeObstacles()
    startGame()
  }

  // 选择关卡
  const selectLevel = (level) => {
    if (level < 1 || level > MAX_LEVEL) return
    
    currentLevel.value = level
    levelScore.value = 0
    initializeObstacles()
  }

  // 选择难度（现在基于关卡自动确定，保留接口兼容性）
  const selectDifficulty = (difficulty) => {
    // 不再手动设置难度，关卡会自动确定难度
    console.log('难度现在基于关卡自动确定:', difficulty)
  }

  // 开始游戏
  const startGame = () => {
    if (gameStatus.value === GAME_STATUS.RUNNING) return
    
    initializeSnake()
    initializeObstacles()
    generateFood()
    if (gameStatus.value === GAME_STATUS.IDLE) {
      score.value = 0
      levelScore.value = 0
    }
    direction.value = DIRECTIONS.RIGHT
    nextDirection.value = DIRECTIONS.RIGHT
    gameStatus.value = GAME_STATUS.RUNNING

    gameLoop = setInterval(gameStep, currentGameSpeed.value)
  }

  // 暂停游戏
  const pauseGame = () => {
    if (gameStatus.value === GAME_STATUS.RUNNING) {
      gameStatus.value = GAME_STATUS.PAUSED
      clearInterval(gameLoop)
    } else if (gameStatus.value === GAME_STATUS.PAUSED) {
      gameStatus.value = GAME_STATUS.RUNNING
      gameLoop = setInterval(gameStep, currentGameSpeed.value)
    }
  }

  // 游戏结束
  const gameOver = () => {
    gameStatus.value = GAME_STATUS.GAME_OVER
    clearInterval(gameLoop)
  }

  // 重置游戏
  const resetGame = () => {
    clearInterval(gameLoop)
    gameStatus.value = GAME_STATUS.IDLE
    score.value = 0
    levelScore.value = 0
    snake.length = 0
    initializeSnake()
    initializeObstacles()
    generateFood()
  }

  // 保存游戏进度
  const saveProgress = () => {
    const progress = {
      unlockedLevels: unlockedLevels.value,
      highScores: {
        [currentDifficulty.value]: score.value
      }
    }
    
    try {
      const existingProgress = JSON.parse(localStorage.getItem('snakeGameProgress') || '{}')
      const mergedProgress = {
        ...existingProgress,
        unlockedLevels: Math.max(existingProgress.unlockedLevels || 1, progress.unlockedLevels),
        highScores: {
          ...existingProgress.highScores,
          ...progress.highScores,
          [currentDifficulty.value]: Math.max(
            existingProgress.highScores?.[currentDifficulty.value] || 0,
            progress.highScores[currentDifficulty.value]
          )
        }
      }
      
      localStorage.setItem('snakeGameProgress', JSON.stringify(mergedProgress))
    } catch (error) {
      console.warn('无法保存游戏进度:', error)
    }
  }

  // 加载游戏进度
  const loadProgress = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('snakeGameProgress') || '{}')
      unlockedLevels.value = progress.unlockedLevels || 1
    } catch (error) {
      console.warn('无法加载游戏进度:', error)
    }
  }

  // 键盘事件处理
  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault()
        changeDirection(DIRECTIONS.UP)
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault()
        changeDirection(DIRECTIONS.DOWN)
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault()
        changeDirection(DIRECTIONS.LEFT)
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault()
        changeDirection(DIRECTIONS.RIGHT)
        break
      case ' ':
        event.preventDefault()
        if (gameStatus.value === GAME_STATUS.IDLE || gameStatus.value === GAME_STATUS.GAME_OVER) {
          startGame()
        } else {
          pauseGame()
        }
        break
    }
  }

  // 生命周期
  onMounted(() => {
    loadProgress()
    initializeSnake()
    initializeObstacles()
    generateFood()
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    clearInterval(gameLoop)
    window.removeEventListener('keydown', handleKeyPress)
  })

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
    loadProgress
  }
}