import React from 'react'
import { useAuth } from '../context/authContext'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {

  const {token, loading} = useAuth();

  if(loading) {
    return <h2>Loading...</h2>;
  }

  return (
    token ? children : <Navigate to="/login"/>
  )
}

export default ProtectedRoute
