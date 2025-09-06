<template>
  <div class="game-board">
    <div 
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
      }"
    >
      <div
        v-for="cellIndex in totalCells"
        :key="`cell-${cellIndex}`"
        class="cell"
        :class="{
          'snake-head': isSnakeHead(getCellX(cellIndex), getCellY(cellIndex)),
          'snake-body': isSnakeBody(getCellX(cellIndex), getCellY(cellIndex)),
          'food': isFood(getCellX(cellIndex), getCellY(cellIndex)),
          'obstacle': isObstacle(getCellX(cellIndex), getCellY(cellIndex))
        }"
      />
    </div>
  </div>
</template>

<script>
import { GRID_SIZE } from '../types/game.js'

export default {
  name: 'GameBoard',
  props: {
    snake: {
      type: Array,
      required: true
    },
    food: {
      type: Object,
      required: true
    },
    obstacles: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const totalCells = GRID_SIZE * GRID_SIZE

    const getCellX = (cellIndex) => {
      return (cellIndex - 1) % GRID_SIZE
    }

    const getCellY = (cellIndex) => {
      return Math.floor((cellIndex - 1) / GRID_SIZE)
    }

    const isSnakeHead = (x, y) => {
      return props.snake.length > 0 && 
             props.snake[0].x === x && 
             props.snake[0].y === y
    }

    const isSnakeBody = (x, y) => {
      return props.snake.some((segment, index) => 
        index > 0 && segment.x === x && segment.y === y
      )
    }

    const isFood = (x, y) => {
      return props.food.x === x && props.food.y === y
    }

    const isObstacle = (x, y) => {
      return props.obstacles.some(obstacle => obstacle.x === x && obstacle.y === y)
    }

    return {
      GRID_SIZE,
      totalCells,
      getCellX,
      getCellY,
      isSnakeHead,
      isSnakeBody,
      isFood,
      isObstacle
    }
  }
}
</script>

<style scoped>
.game-board {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.grid {
  display: grid;
  gap: 0;
  background-color: rgba(30, 58, 95, 0.1);
  border: 2px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
  padding: 0;
  width: 450px;
  height: 450px;
}

.cell {
  background-color: transparent;
  border-radius: 0;
  transition: all 0.1s ease;
}

.snake-head {
  background-color: #00c851;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.4), 0 0 8px rgba(0, 200, 81, 0.6);
  transform: scale(0.95);
  border-radius: 3px;
}

.snake-body {
  background-color: #00a037;
  transform: scale(0.9);
  border-radius: 3px;
  box-shadow: 0 0 4px rgba(0, 160, 55, 0.4);
}

.food {
  background-color: #ff3547;
  border-radius: 50%;
  transform: scale(0.8);
  box-shadow: 0 0 15px rgba(255, 53, 71, 0.7), inset 0 0 8px rgba(255, 255, 255, 0.3);
  animation: pulse 1s infinite;
}

.obstacle {
  background-color: #2d4a66;
  border: 2px solid #1e3a5f;
  box-shadow: 
    inset 0 0 10px rgba(0, 0, 0, 0.5),
    0 0 8px rgba(45, 74, 102, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.3);
  transform: scale(1);
  border-radius: 2px;
}

@keyframes pulse {
  0% { transform: scale(0.8); }
  50% { transform: scale(0.9); }
  100% { transform: scale(0.8); }
}

@media (max-width: 480px) {
  .grid {
    width: 300px;
    height: 300px;
  }
}
</style>