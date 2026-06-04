import React from 'react'
import { useAuth } from '../context/authContext'
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}) => {

  const {token, loading} = useAuth();

  if(loading) {
    return <h2>Loading...</h2>;
  }

  return token ? (
    <Navigate to="/chat"/>
  ) : (
    children
  )
}

export default PublicRoute
