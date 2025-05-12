import { useNavigate } from 'react-router'
import './Home.less'
import { useState } from 'react';
interface Ranking{
  name:string;
  score:number;
  time:number;
  date:string;
}
const rankingComparator = (a:Ranking,b:Ranking) => {
  if(a.score!== b.score)
    return b.score - a.score;
  else if(a.time!== b.time)
    return a.time - b.time;
  else
    return new Date(a.date).getTime() - new Date(b.date).getTime();
};
export default function Home() {
  const [rankingList] = useState(JSON.parse(localStorage.getItem('rankingList')??'[]').sort((a:Ranking,b:Ranking)=>rankingComparator(a,b)).splice(0,15));
  const [isShowRank,setIsShowRank] = useState(false);
  const [name,setName] = useState(localStorage.getItem('snakeName')??'隐姓埋名');
  const navigate = useNavigate();
  const handleStart = () => {
    localStorage.setItem('snakeName',name);
    navigate('/game');
  }
  return (
    <div className="home-page">
      <h1 className="title">贪吃蛇</h1>
      <div className="desc">
        <p className="text">贪吃蛇是经典的经典游戏，玩家控制一个蛇，吃掉食物，长大，但如果蛇撞到自己或边界，游戏结束。</p>
        <div className="key">
          <p>W-上</p>
          <p>A-左</p>
          <p>S-下</p>
          <p>D-右</p>
        </div>
      </div>
      <input className='name' value={name} onChange={(e) => setName(e.target.value)} type="text"/> 
      <button className="start-btn" onClick={handleStart}>开始游戏</button>
      <button className="rank-btn" onClick={()=>setIsShowRank(true)}>排行榜</button>
      {isShowRank?
        <div className="rank-list">
          <h2 className="rank-title">排行榜</h2>
          <table className='rank-table'>
            <thead>
              <tr>
                <th>名次</th>
                <th>得分</th>
                <th>时间</th>
                <th>昵称</th>
                <th>日期</th>
              </tr>
            </thead>
            {rankingList.map((item:Ranking,index:number)=>(
              
              <tr key={index} className='rank-item'>
                <td className='rank-num'>{index+1}</td>
                <td className='rank-score'>{item.score}</td>
                <td className='rank-time'>{item.time/1000}s</td>
                <td className='rank-name'>{item.name}</td>
                <td className='rank-date'>{new Date(item.date).toLocaleString()}</td>
              </tr>
            ))}
          </table>
          <button className="close-btn" onClick={()=>setIsShowRank(false)}>关闭</button>
        </div>
      :null}
    </div>
  )
}
