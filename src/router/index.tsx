import {createBrowserRouter} from 'react-router'
import Home from '@pages/home/Home'
import Game from '@pages/game/Game'
import End from '@pages/end/End'
const routes = [
    {
        path: '/',
        element:<Home/>
    },
    {
        path: '/game',
        element:<Game/>
    },
    {
        path: '/end',
        element:<End/>
    }
]
const router = createBrowserRouter(routes)
export default router
