import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCapsuleById } from '../services/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, Unlock } from 'lucide-react';

const CapsuleView = () => {
    const { id } = useParams();
    const [capsule, setCapsule] = useState(null);
    const [isLocked, setIsLocked] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const c = getCapsuleById(id);
        if (c) {
            setCapsule(c);
            const unlockDate = new Date(c.unlockDate);
            if (new Date() >= unlockDate) {
                setIsLocked(false);
            } else {
                // Countdown logic
                const updateTimer = () => {
                    const now = new Date();
                    const diff = unlockDate - now;
                    if (diff <= 0) {
                        setIsLocked(false);
                        setTimeLeft('Unlocked!');
                    } else {
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                    }
                };
                updateTimer();
                const interval = setInterval(updateTimer, 1000);
                return () => clearInterval(interval);
            }
        }
    }, [id]);

    if (!capsule) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Capsule not found.</div>;

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 20px' }}>
            <Link to="/" style={{ position: 'absolute', top: '100px', left: '40px', color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <ArrowLeft size={18} /> Back to Vault
            </Link>

            <AnimatePresence mode="wait">
                {isLocked ? (
                    <motion.div
                        key="locked"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        style={{ textAlign: 'center', marginTop: '60px' }}
                    >
                        <div style={{ background: 'rgba(255, 71, 87, 0.1)', padding: '30px', borderRadius: '50%', display: 'inline-block', marginBottom: '2rem' }}>
                            <Lock size={64} color="var(--color-danger)" />
                        </div>
                        <h1 style={{ marginBottom: '1rem', fontSize: '3rem' }}>Sealed until future.</h1>
                        <div style={{ fontSize: '2.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)', letterSpacing: '2px' }}>
                            {timeLeft}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="unlocked"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, type: 'spring' }}
                        className="glass-panel"
                        style={{ padding: '4rem', maxWidth: '800px', width: '100%', textAlign: 'center', marginTop: '60px' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            style={{ display: 'inline-block', padding: '20px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.1)', marginBottom: '2.5rem' }}
                        >
                            <Unlock size={48} color="var(--color-success)" />
                        </motion.div>

                        {capsule.imageUrl && (
                            <motion.img
                                src={capsule.imageUrl}
                                alt="Memory"
                                style={{ maxWidth: '100%', borderRadius: '20px', marginBottom: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            />
                        )}

                        <motion.p
                            style={{ fontSize: '1.4rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#eee', marginBottom: '3rem' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            {capsule.message}
                        </motion.p>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Sealed on {new Date(capsule.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CapsuleView;
