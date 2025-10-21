import { } from 'react'
import {BrowserRouter, Routes, Route} from  'react-router-dom'
import InfoPage from './pages/infopage'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="MiniPOS/" element={<InfoPage />} />
        <Route path='MiniPOS/login' element={<Login />} />
        <Route path='MiniPOS/register' element={<Register />} />
        <Route path='MiniPOS/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
