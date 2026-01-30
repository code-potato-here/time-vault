import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Hourglass } from 'lucide-react'
import './index.css'

import AuthButton from './components/AuthButton'
import Vault from './components/Vault'
import CapsuleCreator from './components/CapsuleCreator'
import CapsuleView from './components/CapsuleView'
import { initGoogleClient } from './services/googleCalendar'

function App() {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                await initGoogleClient("", "");
            } catch (e) {
                console.log("GAPI init deferred or failed", e);
            }
        };
        initialize();
    }, []);

    return (
        <Router>
            <div className="app-container" style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                {/* Navbar */}
                <nav style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 40px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(5, 5, 5, 0.6)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                            padding: '8px',
                            borderRadius: '10px',
                            boxShadow: '0 0 15px var(--color-accent-glow)'
                        }}>
                            <Hourglass size={20} color="white" />
                        </div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                            ChronoBox
                        </h1>
                    </Link>
                    <AuthButton onAuthChange={setIsSignedIn} />
                </nav>

                {/* Main Content Area */}
                <main style={{ flex: 1, marginTop: '80px', display: 'flex', flexDirection: 'column' }}>
                    <Routes>
                        <Route path="/" element={<Vault />} />
                        <Route path="/create" element={<CapsuleCreator isSignedIn={isSignedIn} />} />
                        <Route path="/open/:id" element={<CapsuleView />} />
                    </Routes>
                </main>

                <footer style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                    <p>&copy; {new Date().getFullYear()} ChronoBox. Sealed for the future.</p>
                </footer>
            </div>
        </Router>
    )
}

export default App
