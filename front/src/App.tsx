import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { Home } from './pages/Home'
import Footer from './components/Footer'
import Login from './pages/Login'
import { Appointment } from './pages/Appointment'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Chatbot from './pages/Chatbot'
import Dashboard from './pages/Dashboard'
import UserProfile from './pages/UserProfile'
import DASS21 from './pages/DASS21'
import Wellness from './pages/Wellness'
import RouteGuard from './components/RouteGuard'

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <ToastContainer position='top-right' autoClose={3000} />
      <Navbar />
      <div className='h-[64px] shrink-0' />
      <div className='flex-1 flex flex-col'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/appointment' element={<RouteGuard requireDass><Appointment /></RouteGuard>} />
          <Route path='/chat' element={<Chatbot />} />
          <Route path='/dashboard' element={<RouteGuard><Dashboard /></RouteGuard>} />
          <Route path='/profile' element={<UserProfile/>} />
          <Route path='/dass21' element={<RouteGuard><DASS21 /></RouteGuard>} />
          <Route path='/mindfulness' element={<Wellness />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
export default App
