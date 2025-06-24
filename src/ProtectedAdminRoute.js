import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

function ProtectedAdminRoute({ children }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const role = useSelector(state => state.auth.role);
    if (isAuthenticated && role === 'admin') {
        return children;
    }

    return <Navigate to="/" />;
}

export default ProtectedAdminRoute;