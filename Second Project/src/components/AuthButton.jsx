import React, { useState } from 'react';
import { handleAuthClick, handleSignoutClick, initGoogleClient } from '../services/googleCalendar';
import { LogIn, LogOut } from 'lucide-react';

const AuthButton = ({ onAuthChange }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    // Note: Client ID and API Key should ideally come from env vars or user input for this demo
    // For now, we will ask the user to input them if not set, or hardcode if they provided them.
    // Since we are building for a user, we will add a small configuration modal or inputs if needed.
    // But for the button, we assume init is called globaly or here.

    // We'll expose a way to init if not inited.

    const handleAuth = async () => {
        try {
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
            console.error("Auth error", error);
            alert("Authentication failed. Please check console.");
        }
    };

    return (
        <button
            onClick={handleAuth}
            className="btn-secondary"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.05)',
                fontSize: '0.9rem',
                padding: '10px 20px'
            }}
        >
            {isSignedIn ? <LogOut size={16} /> : <LogIn size={16} />}
            {isSignedIn ? 'Sign Out' : 'Sign In'}
        </button>
    );
};

export default AuthButton;
