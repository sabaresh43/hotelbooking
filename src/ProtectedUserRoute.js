import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

function ProtectedUserRoute({ children }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const role = useSelector(state => state.auth.role);
    if (isAuthenticated && role === 'user') {
        return children;
    }

    return <Navigate to="/" />;
}

export default ProtectedUserRoute;