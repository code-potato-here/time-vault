import React, { useState } from 'react';
import { Calendar, Image as ImageIcon, Lock, Send, ArrowLeft } from 'lucide-react';
import { saveCapsule } from '../services/storage';
import { createCalendarEvent } from '../services/googleCalendar';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CapsuleCreator = ({ isSignedIn }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSignedIn) {
            alert("Please sign in to schedule the capsule unlock.");
            return;
        }
        if (!message && !image) {
            alert("Please add a message or image.");
            return;
        }
        if (!date) {
            alert("Please select an unlock date.");
            return;
        }

        setLoading(true);
        try {
            const capsuleId = crypto.randomUUID();
            const unlockDateISO = new Date(date).toISOString();

            const capsuleData = {
                id: capsuleId,
                message,
                imageUrl: image,
                unlockDate: unlockDateISO,
                title: message ? (message.substring(0, 20) + (message.length > 20 ? '...' : '')) : 'Image Memory',
                createdAt: new Date().toISOString(),
                isSynced: false
            };

            // 1. Create Calendar Event
            const event = await createCalendarEvent(capsuleData);

            // 2. Save Locally with event ID
            capsuleData.calendarEventId = event.id;
            capsuleData.isSynced = true;
            saveCapsule(capsuleData);

            // 3. Navigate to Vault
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Failed to seal capsule. Check API configuration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel"
                style={{ padding: '3rem', maxWidth: '600px', width: '100%' }}
            >
                <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back to Vault
                </Link>

                <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Seal a Memory</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Choose when this moment returns to you.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>MESSAGE</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="What do you want to tell your future self?"
                            rows={5}
                            style={{ width: '100%', resize: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>UNLOCK DATE</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ paddingLeft: '48px' }}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>IMAGE (OPTIONAL)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="btn-secondary" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                width: '100%',
                                padding: '20px',
                                borderStyle: 'dashed',
                                background: image ? 'rgba(0, 255, 157, 0.05)' : 'rgba(255,255,255,0.02)'
                            }}>
                                <ImageIcon size={20} /> {image ? 'Change Image' : 'Upload Image'}
                            </label>
                        </div>
                        {image && (
                            <div style={{ marginTop: '15px', borderRadius: '12px', overflow: 'hidden', height: '200px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '10px', padding: '16px' }}>
                        {loading ? 'Sealing Capsule...' : 'Seal Capsule'} {!loading && <Lock size={18} />}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default CapsuleCreator;
