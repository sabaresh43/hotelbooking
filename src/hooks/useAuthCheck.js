// hooks/useAuthCheck.js
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useAuthCheck = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const checkAuth = (callback) => {
        if (!isAuthenticated) {
            setShowLoginDialog(true);
            return false;
        }
        if (callback) callback();
        return true;
    };

    return {
        isAuthenticated,
        showLoginDialog,
        setShowLoginDialog,
        checkAuth
    };
};