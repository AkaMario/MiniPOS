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
        <Route path="/" element={<InfoPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
