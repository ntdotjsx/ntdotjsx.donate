import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './userAuthContext';

export const ProtectedRoute = ({ element }) => {
    const { user } = useAuth();

    return user ? element : <Navigate to="/oauth" replace />;
};

export const ProtectedAuth = ({ element }) => {
    const { user } = useAuth();

    if (!user) {
        return element;
    }

    return user.role === "ADMIN" 
        ? <Navigate to="/admin-controller" replace /> 
        : <Navigate to="/dashboard" replace />;
};
