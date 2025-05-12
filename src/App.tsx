import router from '@/router/index.tsx'
import {RouterProvider} from 'react-router'
import { useEffect, useRef } from 'react'
import './App.less'
export default function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const setWindosSize = ()=>{
    const {innerWidth,innerHeight} = window
    const appDom = appRef.current as HTMLDivElement;
    const value = (innerWidth>innerHeight? innerHeight : innerWidth)+'px';
    appDom.style.width = value;
    appDom.style.height = value;
  } 
  useEffect(setWindosSize,[]);
  window.addEventListener('resize',setWindosSize);
  return (
    <div className="app" ref={appRef}>
      <RouterProvider router={router}/>
    </div>
  )
}
