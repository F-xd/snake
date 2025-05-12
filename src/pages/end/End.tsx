import { useState } from 'react';
import { useNavigate } from 'react-router'
import './End.less'

export default function End() {
  const rankingList=JSON.parse(localStorage.getItem('rankingList')??'[]')

  const navigate = useNavigate();
  const [time] = useState(rankingList[rankingList.length-1]?.time);
  const [score] = useState(rankingList[rankingList.length-1]?.score);
  return (
    <div className='end-page'>
      <h1>游戏结束</h1>
      <p className="time">用时：{time/1000}秒</p>
      <p className="score">得分：{score}</p>
      <button className='again-btn' onClick={()=>navigate('/game')}>再来一局</button>
      <button className='home-btn' onClick={()=>navigate('/')}>返回首页</button>
    </div>
  )
}
