import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import ChatPage from '../pages/ChatPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const AppRoute = () => {
  return (
    <Routes>
      <Route path='/' element={
        <PublicRoute>
          <RegisterPage/>
        </PublicRoute>
      }/>
      <Route path='/login' element={
        <PublicRoute>
          <LoginPage/>
        </PublicRoute>
      }/>
      <Route path='/chat' 
        element={<ProtectedRoute>
          <ChatPage/>
        </ProtectedRoute>}/>
    </Routes>
  )
}

export default AppRoute
