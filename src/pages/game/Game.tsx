import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './Game.less'
import _ from 'lodash';
// 网格大小
const SIZE = 20;
// 初始速度(毫秒)
let SPEED = 300;
// 排行榜

// 本局游戏得分
let score = 0;
// 游戏时间
let time = 0;

// 方向列表
const directions = {
  up: 0,
  down: 1,
  left: 2,
  right: 3
}
// 当前方向
let currentDirection = directions.right;
// 最终蛇移动方向 （防止键盘连续改变方向 触发bug）
let snakeDirection = directions.right;
let snakeBody = [[0, 1], [0, 0]];
// 随机食物
const newFood = () => {
  const x = _.random(0, SIZE - 1);
  const y = _.random(0, SIZE - 1);
  if (snakeBody.some(([sx, sy]) => sx === x && sy === y)) {
    return newFood();
  }
  return [x, y];
}

// 键盘事件（控制方向）
const handleKeyDown = (e: KeyboardEvent) => {
  const key = e.key;
  switch (key) {
    case 'ArrowUp': case 'w': case 'W':
      console.log('up');
      if (snakeDirection == directions.down) break;
      currentDirection = directions.up;
      break;
    case 'ArrowDown': case 's': case 'S':
      console.log('down');
      if (snakeDirection == directions.up) break;
      currentDirection = directions.down;
      break;
    case 'ArrowLeft': case 'a': case 'A':
      console.log('left');
      if (snakeDirection == directions.right) break;
      currentDirection = directions.left;
      break;
    case 'ArrowRight': case 'd': case 'D':
      console.log('right');
      if (snakeDirection == directions.left) break;
      currentDirection = directions.right;
      break;
    default:
      break;
  }
}
const initGridList = () => {
  const gridList = [] as number[][];
    for (let i = 0; i < SIZE; i++) {
      gridList.push([]);
      for (let j = 0; j < SIZE; j++) {
        gridList[i].push(0);
      }
    }
    snakeBody.forEach(([i, j]) => gridList[i][j] = 1)
    const [fx, fy] = newFood();
    gridList[fx][fy] = 2;
    return gridList;
}
export default function Game() {
  const rankingList = JSON.parse(localStorage.getItem('rankingList')??'[]');
  const name = localStorage.getItem('snakeName')??'隐姓埋名';
  const navigate = useNavigate();
  const [gridList, setGridList] = useState(initGridList());
  // 结束游戏
  const gameOver = () => {
    const date = new Date();
    rankingList.push({score,time,date,name});
    localStorage.setItem('rankingList', JSON.stringify(rankingList));
    score = 0;
    time = 0;
    snakeBody = [[0, 1], [0, 0]];
    currentDirection = directions.right;
    snakeDirection = directions.right;
    navigate('/end');
  }
  // 渲染网格
  const renderCell = (i: number, j: number) => {
    const value = gridList[i][j];
    if (value === 0) return null;
    else if(value === 2) return <div className='food'></div>;
    else {
      if (snakeBody[0][0] == i && snakeBody[0][1] == j)
        return <div className='snake-header'></div>;
      else return <div className='snake-body'></div>;
    }
  }

  // 键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 蛇移动
  useEffect(() => {
    console.log(snakeBody);
    setTimeout(() => {
      const newGridList = _.cloneDeep(gridList);
      snakeDirection = currentDirection;
      // 蛇头向当前方向移动
      switch (snakeDirection) {
        case directions.up:
          snakeBody.unshift([snakeBody[0][0] - 1, snakeBody[0][1]]);
          break;
        case directions.down:
          snakeBody.unshift([snakeBody[0][0] + 1, snakeBody[0][1]]);
          break;
        case directions.left:
          snakeBody.unshift([snakeBody[0][0], snakeBody[0][1] - 1]);
          break;
        case directions.right:
          snakeBody.unshift([snakeBody[0][0], snakeBody[0][1] + 1]);
          break;
        default:
          break;
      }
      // 边界犯规处理
      if (snakeBody[0][0] < 0 || snakeBody[0][0] >= SIZE || snakeBody[0][1] < 0 || snakeBody[0][1] >= SIZE) {
        gameOver();
        return;
      }

      // 如果是食物    重新生成食物
      // 如果不是食物  对蛇尾处理
      if (newGridList[snakeBody[0][0]][snakeBody[0][1]] === 2) {
        score++;
        // 速度加快
        if(SPEED>70)
          SPEED -= 2;
        const [fx, fy] = newFood();
        newGridList[fx][fy] = 2;
      } else {
        // 蛇尾处理
        newGridList[snakeBody[snakeBody.length - 1][0]][snakeBody[snakeBody.length - 1][1]] = 0;
        snakeBody.pop();
      }

      // 判断蛇头是否撞到自己
      if(newGridList[snakeBody[0][0]][snakeBody[0][1]] === 1){
        gameOver();
        return;
      }
      // 在判断完食物后 更新蛇头
      newGridList[snakeBody[0][0]][snakeBody[0][1]] = 1;
      setGridList(newGridList);
      time+=SPEED;
    }, SPEED)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridList])
  return (
    <div className='game-page'>
      <div className='game-board'>
        {gridList.map((row, i) => (
          <div key={i} className='game-board-row'>
            {row.map((_, j) => (
              <div key={j} className={'game-board-cell'}>
                {renderCell(i, j)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
