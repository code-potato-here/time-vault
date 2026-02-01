import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCapsules } from '../services/storage';
import { Lock, Unlock, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Vault = () => {
    const [capsules, setCapsules] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        setCapsules(getCapsules());
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '3.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #ffffff, #a0a8c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}
                    >
                        Time Vault.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}
                    >
                        Preserving moments for the future you.
                    </motion.p>
                </div>

                <Link to="/create" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> New Capsule
                </Link>
            </header>

            {capsules.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel"
                    style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', margin: '0 auto' }}
                >
                    <div style={{ background: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Clock size={32} color="var(--color-text-secondary)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>It's quiet in here.</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Start your journey by sealing your first memory.</p>
                    <Link to="/create" className="btn-primary" style={{ textDecoration: 'none' }}>Begin Now</Link>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {capsules.map((capsule, index) => {
                        const unlockDate = new Date(capsule.unlockDate);
                        const isUnlocked = currentTime >= unlockDate;

                        return (
                            <motion.div
                                key={capsule.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel"
                                style={{
                                    padding: '2rem',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: '220px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    border: isUnlocked ? '1px solid rgba(0, 255, 157, 0.3)' : 'var(--glass-border)'
                                }}
                            >
                                {/* Background Gradient for Card */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-50%',
                                    left: '-50%',
                                    width: '200%',
                                    height: '200%',
                                    background: isUnlocked
                                        ? 'radial-gradient(circle, rgba(0, 255, 157, 0.05) 0%, transparent 60%)'
                                        : 'radial-gradient(circle, rgba(124, 77, 255, 0.05) 0%, transparent 60%)',
                                    zIndex: -1,
                                    pointerEvents: 'none'
                                }} />

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{
                                            background: isUnlocked ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            display: 'inline-flex'
                                        }}>
                                            {isUnlocked ? <Unlock size={20} color="var(--color-success)" /> : <Lock size={20} color="var(--color-danger)" />}
                                        </div>

                                        {!isUnlocked && (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '100px' }}>
                                                {unlockDate.toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                                        {isUnlocked ? capsule.title : 'Sealed Memory'}
                                    </h3>

                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                        {isUnlocked ? 'This capsule is now open.' : `Unlocks at ${unlockDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </p>
                                </div>

                                <Link
                                    to={`/open/${capsule.id}`}
                                    className={isUnlocked ? 'btn-primary' : 'btn-secondary'}
                                    style={{
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        marginTop: '1.5rem',
                                        width: '100%',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        opacity: isUnlocked ? 1 : 0.7,
                                        background: isUnlocked ? 'white' : 'transparent',
                                        color: isUnlocked ? 'black' : 'var(--color-text-secondary)',
                                        borderColor: isUnlocked ? 'transparent' : 'rgba(255,255,255,0.1)'
                                    }}
                                >
                                    {isUnlocked ? 'Open Now' : 'Locked'}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Vault;
