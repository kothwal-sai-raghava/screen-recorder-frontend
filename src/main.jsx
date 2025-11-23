import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './components/Home.jsx'
import Recordings from './components/Recordings.jsx'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path="/recordings" element={<Recordings/>}/>
    </Routes>
  </BrowserRouter>
)
