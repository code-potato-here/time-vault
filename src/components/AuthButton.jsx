import React, { useState, useEffect } from 'react';
import { handleAuthClick, handleSignoutClick, initGoogleClient } from '../services/googleCalendar';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

const AuthButton = ({ onAuthChange }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [initError, setInitError] = useState(null);

    useEffect(() => {
        // Initialize Google Client on mount
        const initialize = async () => {
            try {
                setIsInitializing(true);
                setInitError(null);
                await initGoogleClient();

                // Check if user is already signed in
                if (typeof gapi !== 'undefined' && gapi.client && gapi.client.getToken()) {
                    setIsSignedIn(true);
                    onAuthChange(true);
                }
            } catch (error) {
                console.error("Initialization error:", error);
                setInitError(error.message || 'Failed to initialize. Please refresh the page.');
            } finally {
                setIsInitializing(false);
            }
        };

        initialize();
    }, [onAuthChange]);

    const handleAuth = async () => {
        if (isInitializing || isAuthenticating) return;

        try {
            setIsAuthenticating(true);

            if (isSignedIn) {
                handleSignoutClick();
                setIsSignedIn(false);
                onAuthChange(false);
            } else {
                await handleAuthClick();
                setIsSignedIn(true);
                onAuthChange(true);
            }
        } catch (error) {
            console.error("Auth error:", error);
            alert(error.message || "Authentication failed. Please try again.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    // Show error state
    if (initError) {
        return (
            <button
                disabled
                className="btn-secondary"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: 'none',
                    background: 'rgba(255,100,100,0.1)',
                    fontSize: '0.9rem',
                    padding: '10px 20px',
                    opacity: 0.7,
                    cursor: 'not-allowed'
                }}
                title={initError}
            >
                <LogIn size={16} />
                Init Failed
            </button>
        );
    }

    return (
        <button
            onClick={handleAuth}
            disabled={isInitializing || isAuthenticating}
            className="btn-secondary"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.05)',
                fontSize: '0.9rem',
                padding: '10px 20px',
                opacity: isInitializing || isAuthenticating ? 0.6 : 1,
                cursor: isInitializing || isAuthenticating ? 'wait' : 'pointer'
            }}
        >
            {isInitializing || isAuthenticating ? (
                <Loader2 size={16} className="spinning" />
            ) : isSignedIn ? (
                <LogOut size={16} />
            ) : (
                <LogIn size={16} />
            )}
            {isInitializing ? 'Loading...' : isAuthenticating ? 'Authenticating...' : isSignedIn ? 'Sign Out' : 'Sign In'}
        </button>
    );
};

export default AuthButton;
