export const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
}

export const GAME_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  LEVEL_COMPLETE: 'level_complete'
}

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  HELL: 'hell'
}

export const GRID_SIZE = 20
export const INITIAL_SNAKE_LENGTH = 3

export const DIFFICULTY_CONFIG = {
  [DIFFICULTY.EASY]: {
    name: '简单',
    speed: 200,
    scoreMultiplier: 1,
    requiredScore: 50,
    icon: '😊'
  },
  [DIFFICULTY.MEDIUM]: {
    name: '中等',
    speed: 150,
    scoreMultiplier: 1.5,
    requiredScore: 75,
    icon: '😐'
  },
  [DIFFICULTY.HARD]: {
    name: '困难',
    speed: 100,
    scoreMultiplier: 2,
    requiredScore: 100,
    icon: '😰'
  },
  [DIFFICULTY.HELL]: {
    name: '地狱',
    speed: 70,
    scoreMultiplier: 3,
    requiredScore: 150,
    icon: '💀'
  }
}

export const MAX_LEVEL = 30

// 区域定义
export const ZONE_CONFIG = {
  EASY: { levels: [1, 2, 3, 4, 5, 6, 7, 8], name: '新手区域', baseSpeed: 200, difficulty: DIFFICULTY.EASY },
  MEDIUM: { levels: [9, 10, 11, 12, 13, 14, 15, 16], name: '进阶区域', baseSpeed: 150, difficulty: DIFFICULTY.MEDIUM },
  HARD: { levels: [17, 18, 19, 20, 21, 22, 23, 24], name: '高难区域', baseSpeed: 100, difficulty: DIFFICULTY.HARD },
  HELL: { levels: [25, 26, 27, 28, 29, 30], name: '地狱区域', baseSpeed: 70, difficulty: DIFFICULTY.HELL }
}

// 获取关卡对应的区域配置
export const getLevelZone = (level) => {
  for (const [zoneKey, config] of Object.entries(ZONE_CONFIG)) {
    if (config.levels.includes(level)) {
      return { ...config, key: zoneKey }
    }
  }
  return ZONE_CONFIG.EASY
}

// 计算关卡速度（区域内递增）
export const getLevelSpeed = (level) => {
  const zone = getLevelZone(level)
  const levelInZone = zone.levels.indexOf(level)
  const speedDecrease = levelInZone * 15 // 每关速度增加15ms（数值越小速度越快）
  return Math.max(zone.baseSpeed - speedDecrease, 50) // 最快50ms
}

// 生成障碍物的辅助函数
const generateWalls = (startX, startY, length, direction) => {
  const walls = []
  for (let i = 0; i < length; i++) {
    if (direction === 'horizontal') {
      walls.push({ x: startX + i, y: startY })
    } else {
      walls.push({ x: startX, y: startY + i })
    }
  }
  return walls
}

const generateBox = (startX, startY, width, height, filled = false) => {
  const walls = []
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (filled || i === 0 || i === width - 1 || j === 0 || j === height - 1) {
        walls.push({ x: startX + i, y: startY + j })
      }
    }
  }
  return walls
}

export const LEVEL_CONFIG = {
  // 新手区域 (1-8关)
  1: { name: '启程之路', obstacles: [] },
  
  2: { name: '初试锋芒', obstacles: [
    ...generateWalls(8, 8, 3, 'horizontal')
  ]},
  
  3: { name: '小小迷宫', obstacles: [
    ...generateWalls(5, 5, 4, 'horizontal'),
    ...generateWalls(11, 5, 4, 'horizontal'),
    ...generateWalls(8, 14, 4, 'horizontal')
  ]},
  
  4: { name: '十字路口', obstacles: [
    ...generateWalls(9, 6, 1, 'vertical'),
    ...generateWalls(10, 6, 1, 'vertical'),
    ...generateWalls(9, 13, 1, 'vertical'),
    ...generateWalls(10, 13, 1, 'vertical')
  ]},
  
  5: { name: '边境围栏', obstacles: [
    ...generateWalls(3, 3, 3, 'horizontal'),
    ...generateWalls(14, 3, 3, 'horizontal'),
    ...generateWalls(8, 9, 4, 'horizontal')
  ]},
  
  6: { name: '重重包围', obstacles: [
    ...generateWalls(5, 5, 4, 'horizontal'),
    ...generateWalls(11, 5, 4, 'horizontal'),
    ...generateWalls(8, 14, 4, 'horizontal')
  ]},
  
  7: { name: '螺旋迷途', obstacles: [
    ...generateWalls(3, 6, 5, 'horizontal'),
    ...generateWalls(12, 6, 5, 'horizontal'),
    ...generateWalls(7, 3, 1, 'vertical'),
    ...generateWalls(12, 3, 1, 'vertical'),
    ...generateWalls(7, 16, 1, 'vertical')
  ]},
  
  8: { name: '新手终章', obstacles: [
    ...generateWalls(4, 4, 6, 'horizontal'),
    ...generateWalls(10, 4, 6, 'horizontal'),
    ...generateWalls(7, 15, 6, 'horizontal'),
    ...generateWalls(9, 9, 1, 'vertical')
  ]},
  
  // 进阶区域 (9-16关)
  9: { name: '进阶试炼', obstacles: [
    ...generateWalls(4, 4, 4, 'horizontal'),
    ...generateWalls(12, 4, 4, 'horizontal'),
    ...generateWalls(8, 15, 4, 'horizontal')
  ]},
  
  10: { name: '交叉火力', obstacles: [
    ...generateWalls(7, 9, 6, 'horizontal'),
    ...generateWalls(9, 6, 1, 'vertical'),
    ...generateWalls(10, 13, 1, 'vertical')
  ]},
  
  11: { name: '多重陷阱', obstacles: [
    ...generateWalls(4, 4, 3, 'horizontal'),
    ...generateWalls(13, 4, 3, 'horizontal'),
    ...generateWalls(4, 15, 3, 'horizontal'),
    ...generateWalls(8, 9, 4, 'horizontal')
  ]},
  
  12: { name: '狭窄通道', obstacles: [
    ...generateWalls(3, 7, 4, 'horizontal'),
    ...generateWalls(13, 7, 4, 'horizontal'),
    ...generateWalls(8, 4, 1, 'vertical'),
    ...generateWalls(11, 15, 1, 'vertical')
  ]},
  
  13: { name: '密集火网', obstacles: [
    ...generateWalls(4, 6, 4, 'horizontal'),
    ...generateWalls(12, 6, 4, 'horizontal'),
    ...generateWalls(8, 13, 4, 'horizontal'),
    ...generateWalls(6, 9, 1, 'vertical')
  ]},
  
  14: { name: '层层封锁', obstacles: [
    ...generateWalls(5, 5, 5, 'horizontal'),
    ...generateWalls(10, 5, 5, 'horizontal'),
    ...generateWalls(7, 14, 6, 'horizontal'),
    ...generateWalls(3, 9, 1, 'vertical'),
    ...generateWalls(16, 9, 1, 'vertical')
  ]},
  
  15: { name: '复杂迷宫', obstacles: [
    ...generateWalls(3, 5, 4, 'horizontal'),
    ...generateWalls(13, 5, 4, 'horizontal'),
    ...generateWalls(8, 14, 4, 'horizontal'),
    ...generateWalls(6, 8, 1, 'vertical'),
    ...generateWalls(13, 8, 1, 'vertical')
  ]},
  
  16: { name: '进阶终极', obstacles: [
    ...generateWalls(4, 4, 6, 'horizontal'),
    ...generateWalls(10, 4, 6, 'horizontal'),
    ...generateWalls(7, 15, 6, 'horizontal'),
    ...generateWalls(2, 9, 3, 'horizontal'),
    ...generateWalls(15, 9, 3, 'horizontal')
  ]},
  
  // 高难区域 (17-24关)
  17: { name: '地狱前奏', obstacles: [
    ...generateWalls(3, 4, 5, 'horizontal'),
    ...generateWalls(12, 4, 5, 'horizontal'),
    ...generateWalls(7, 15, 6, 'horizontal'),
    ...generateWalls(5, 9, 1, 'vertical'),
    ...generateWalls(14, 9, 1, 'vertical')
  ]},
  
  18: { name: '钢铁丛林', obstacles: [
    ...generateWalls(2, 6, 5, 'horizontal'),
    ...generateWalls(13, 6, 5, 'horizontal'),
    ...generateWalls(7, 3, 1, 'vertical'),
    ...generateWalls(12, 3, 1, 'vertical'),
    ...generateWalls(9, 16, 1, 'vertical')
  ]},
  
  19: { name: '死亡陷阱', obstacles: [
    ...generateWalls(4, 5, 4, 'horizontal'),
    ...generateWalls(12, 5, 4, 'horizontal'),
    ...generateWalls(8, 14, 4, 'horizontal'),
    ...generateWalls(2, 9, 3, 'horizontal'),
    ...generateWalls(15, 9, 3, 'horizontal')
  ]},
  
  20: { name: '无尽迷宫', obstacles: [
    ...generateWalls(3, 6, 5, 'horizontal'),
    ...generateWalls(12, 6, 5, 'horizontal'),
    ...generateWalls(7, 13, 6, 'horizontal'),
    ...generateWalls(6, 3, 1, 'vertical'),
    ...generateWalls(13, 16, 1, 'vertical')
  ]},
  
  21: { name: '极限挑战', obstacles: [
    ...generateWalls(4, 4, 6, 'horizontal'),
    ...generateWalls(10, 4, 6, 'horizontal'),
    ...generateWalls(7, 15, 6, 'horizontal'),
    ...generateWalls(2, 9, 4, 'horizontal'),
    ...generateWalls(14, 9, 4, 'horizontal')
  ]},
  
  22: { name: '密不透风', obstacles: [
    ...generateWalls(2, 5, 5, 'horizontal'),
    ...generateWalls(11, 5, 5, 'horizontal'),
    ...generateWalls(6, 14, 6, 'horizontal'),
    ...generateWalls(5, 8, 1, 'vertical'),
    ...generateWalls(13, 8, 1, 'vertical'),
    ...generateWalls(9, 11, 1, 'vertical')
  ]},
  
  23: { name: '终极考验', obstacles: [
    ...generateWalls(3, 6, 5, 'horizontal'),
    ...generateWalls(12, 6, 5, 'horizontal'),
    ...generateWalls(7, 13, 6, 'horizontal'),
    ...generateWalls(1, 9, 4, 'horizontal'),
    ...generateWalls(15, 9, 4, 'horizontal'),
    ...generateWalls(6, 3, 1, 'vertical')
  ]},
  
  24: { name: '高难终章', obstacles: [
    ...generateWalls(4, 4, 6, 'horizontal'),
    ...generateWalls(10, 4, 6, 'horizontal'),
    ...generateWalls(7, 15, 6, 'horizontal'),
    ...generateWalls(2, 9, 4, 'horizontal'),
    ...generateWalls(14, 9, 4, 'horizontal'),
    ...generateWalls(9, 2, 1, 'vertical')
  ]},
  
  // 地狱区域 (25-30关)
  25: { name: '地狱之门', obstacles: [
    ...generateWalls(2, 5, 5, 'horizontal'),
    ...generateWalls(11, 5, 5, 'horizontal'),
    ...generateWalls(6, 14, 6, 'horizontal'),
    ...generateWalls(5, 8, 1, 'vertical'),
    ...generateWalls(13, 8, 1, 'vertical'),
    ...generateWalls(9, 11, 1, 'vertical')
  ]},
  
  26: { name: '炼狱之火', obstacles: [
    ...generateWalls(3, 4, 6, 'horizontal'),
    ...generateWalls(11, 4, 6, 'horizontal'),
    ...generateWalls(7, 15, 6, 'horizontal'),
    ...generateWalls(1, 9, 5, 'horizontal'),
    ...generateWalls(14, 9, 5, 'horizontal'),
    ...generateWalls(9, 2, 1, 'vertical'),
    ...generateWalls(10, 17, 1, 'vertical')
  ]},
  
  27: { name: '绝望深渊', obstacles: [
    ...generateWalls(2, 4, 6, 'horizontal'),
    ...generateWalls(10, 4, 6, 'horizontal'),
    ...generateWalls(6, 15, 6, 'horizontal'),
    ...generateWalls(4, 8, 1, 'vertical'),
    ...generateWalls(12, 8, 1, 'vertical'),
    ...generateWalls(8, 11, 1, 'vertical'),
    ...generateWalls(1, 9, 4, 'horizontal'),
    ...generateWalls(15, 9, 4, 'horizontal')
  ]},
  
  28: { name: '末日审判', obstacles: [
    ...generateWalls(3, 4, 6, 'horizontal'),
    ...generateWalls(11, 4, 6, 'horizontal'),
    ...generateWalls(7, 15, 6, 'horizontal'),
    ...generateWalls(2, 9, 5, 'horizontal'),
    ...generateWalls(13, 9, 5, 'horizontal'),
    ...generateWalls(9, 2, 1, 'vertical'),
    ...generateWalls(10, 17, 1, 'vertical'),
    ...generateWalls(6, 11, 1, 'vertical')
  ]},
  
  29: { name: '终极噩梦', obstacles: [
    ...generateWalls(2, 3, 6, 'horizontal'),
    ...generateWalls(10, 3, 6, 'horizontal'),
    ...generateWalls(6, 16, 6, 'horizontal'),
    ...generateWalls(4, 7, 1, 'vertical'),
    ...generateWalls(12, 7, 1, 'vertical'),
    ...generateWalls(8, 13, 1, 'vertical'),
    ...generateWalls(1, 10, 5, 'horizontal'),
    ...generateWalls(14, 10, 5, 'horizontal')
  ]},
  
  30: { name: '终极挑战', obstacles: [
    ...generateWalls(2, 3, 6, 'horizontal'),
    ...generateWalls(10, 3, 6, 'horizontal'),
    ...generateWalls(6, 16, 6, 'horizontal'),
    ...generateWalls(1, 8, 6, 'horizontal'),
    ...generateWalls(13, 8, 6, 'horizontal'),
    ...generateWalls(1, 11, 6, 'horizontal'),
    ...generateWalls(13, 11, 6, 'horizontal'),
    ...generateWalls(4, 6, 1, 'vertical'),
    ...generateWalls(12, 6, 1, 'vertical'),
    ...generateWalls(8, 13, 1, 'vertical')
  ]}
}