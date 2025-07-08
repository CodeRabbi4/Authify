import './App.css'
import {Routes, Route} from "react-router-dom"
import Home from './Pages/Home'
import Login from './Pages/Login'
import EmailVerify from './Pages/EmailVerify'
import PassReset from './Pages/PassReset'
import { ToastContainer } from 'react-toastify';

function App() {
  

  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/email-verify' element= {<EmailVerify/>}/>
        <Route path='/reset-password' element= {<PassReset/>}/>
      </Routes>
    </>
  )
}

export default App
