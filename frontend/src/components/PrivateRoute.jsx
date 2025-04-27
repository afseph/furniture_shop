import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Spinner from './Spinner';

const PrivateRoute = ({ children }) => {
  const { isAdmin, loading } = useSelector(state => state.auth);
  console.log(isAdmin, loading)

  if (loading) {
    return <Spinner />;   // Можно красивее потом оформить спиннер
  }

  return isAdmin ? children : <Navigate to="/" />;
};

export default PrivateRoute;
