import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Spinner from './Spinner';

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <Spinner />;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default AuthenticatedRoute;
