import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Signin } from './pages/Signin'
import { Dashboard } from './pages/Dashboard'
import { Landing } from './pages/landing'
// import { ToastContainer } from 'react-toastify'
import { Signup } from './pages/Signup'
import { Checkout } from './pages/Checkout'

function App() {

  return (
    
    <>
      {/* <ToastContainer aria-label='toast' /> */}
       <BrowserRouter>
          <Routes>
              <Route path="/signin" element={<Signin />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/dashboard" element={<Dashboard/>}></Route>
              <Route path="/checkout" element={<Checkout/>}></Route>
              <Route path="/" element={<Landing/>}></Route>

              //if any other route is accessed, redirect to landing page
              <Route path="*" element={<Landing/>}></Route>
          </Routes>
       </BrowserRouter>
       
    </>
  )
}

export default App
