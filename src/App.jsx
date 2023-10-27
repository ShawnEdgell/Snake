import { useState, useEffect } from 'react';
import './style.css';

const ROWS = 20;
const COLUMNS = 20;
const CELL_SIZE = 30;

const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const App = () => {
  const [snake, setSnake] = useState([
    { row: 5, col: 5 },
    { row: 5, col: 4 },
    { row: 5, col: 3 },
  ]);
  const [food, setFood] = useState(getRandomFoodPosition());
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowDown':
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        case 'ArrowLeft':
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowRight':
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case Direction.UP:
          head.row -= 1;
          break;
        case Direction.DOWN:
          head.row += 1;
          break;
        case Direction.LEFT:
          head.col -= 1;
          break;
        case Direction.RIGHT:
          head.col += 1;
          break;
        default:
          break;
      }

      newSnake.unshift(head);

      if (head.row === food.row && head.col === food.col) {
        setFood(getRandomFoodPosition());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const checkCollision = () => {
      const head = snake[0];

      // Check if the snake hits the wall
      if (
        head.row < 0 ||
        head.row >= ROWS ||
        head.col < 0 ||
        head.col >= COLUMNS
      ) {
        setIsGameOver(true);
        return;
      }

      // Check if the snake hits itself
      for (let i = 1; i < snake.length; i++) {
        if (head.row === snake[i].row && head.col === snake[i].col) {
          setIsGameOver(true);
          return;
        }
      }
    };

    const gameInterval = setInterval(() => {
      moveSnake();
      checkCollision();
    }, 200);

    return () => {
      clearInterval(gameInterval);
    };
  }, [snake, direction, food, isGameOver]);

  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      const cols = [];
      for (let j = 0; j < COLUMNS; j++) {
        cols.push(
          <div
            key={`${i}-${j}`}
            className={`cell ${
              snake.some((segment) => segment.row === i && segment.col === j)
                ? 'snake'
                : ''
            } ${
              food.row === i && food.col === j ? 'food' : ''
            }`}
            style={{
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
            }}
          ></div>
        );
      }
      rows.push(
        <div className="row" key={i}>
          {cols}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="game-container">
      <div className={`game-board ${isGameOver ? 'game-over' : ''}`}>
        {renderGrid()}
      </div>
      {isGameOver && (
        <div className="game-over-message">
          <p>Game Over!</p>
          <p>Your score: {snake.length - 3}</p>
        </div>
      )}
    </div>
  );
};

const getRandomFoodPosition = () => {
  const row = Math.floor(Math.random() * ROWS);
  const col = Math.floor(Math.random() * COLUMNS);
  return { row, col };
};

export default App;
