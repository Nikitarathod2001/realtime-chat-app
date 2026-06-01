import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import ChatPage from '../pages/ChatPage';

const ApiRoute = () => {
  return (
    <Routes>
      <Route path='/' element={<RegisterPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/chat' element={<ChatPage/>}/>
    </Routes>
  )
}

export default ApiRoute
