import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { Landing } from './pages/landing'

function App() {

  return (
    <>
       <BrowserRouter>
          <Routes>
              <Route path="/signin" element={<Signin />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/dashboard" element={<Dashboard/>}></Route>
              <Route path="/" element={<Landing/>}></Route>
          </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
