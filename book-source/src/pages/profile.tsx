import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useSession } from '@/lib/auth-client';
import { useHistory } from '@docusaurus/router';

export default function Profile() {
    const { data: session } = useSession();
    const history = useHistory();
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!session) {
            history.push('/login');
            return;
        }
        setName(session.user?.name || '');
        setProfileImage(session.user?.image || '');
    }, [session, history]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:3001/api/user/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, image: profileImage })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Reload the page to refresh session data
                setTimeout(() => window.location.reload(), 1500);
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return null;
    }

    return (
        <Layout title="Edit Profile" description="Edit your profile">
            <div className="container margin-vert--xl" style={{ maxWidth: '600px' }}>
                <h1 className="margin-bottom--lg">Edit Profile</h1>
                <div className="card shadow--md">
                    <div className="card__body">
                        <form onSubmit={handleSubmit}>
                            {/* Profile Image Preview */}
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '4px solid var(--ifm-color-primary)',
                                            marginBottom: '16px'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--ifm-color-primary)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '48px',
                                        marginBottom: '16px'
                                    }}>
                                        {name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>

                            {/* Name Field */}
                            <div className="margin-bottom--md">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            {/* Profile Image URL Field */}
                            <div className="margin-bottom--lg">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                    Profile Image URL
                                </label>
                                <input
                                    type="url"
                                    value={profileImage}
                                    onChange={(e) => setProfileImage(e.target.value)}
                                    placeholder="https://example.com/your-image.jpg"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                        fontSize: '1rem'
                                    }}
                                />
                                <small style={{ color: 'var(--ifm-color-emphasis-600)', marginTop: '4px', display: 'block' }}>
                                    Leave empty to use default avatar
                                </small>
                            </div>

                            {/* Message Display */}
                            {message.text && (
                                <div
                                    className={`alert alert--${message.type === 'success' ? 'success' : 'danger'}`}
                                    style={{ marginBottom: '16px' }}
                                >
                                    {message.text}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="button button--primary button--block"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>

                        {/* Current Session Info */}
                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            backgroundColor: 'var(--ifm-color-emphasis-100)',
                            borderRadius: '8px'
                        }}>
                            <h4 style={{ marginBottom: '8px' }}>Current Profile</h4>
                            <p style={{ margin: '4px 0' }}><strong>Email:</strong> {session.user?.email}</p>
                            <p style={{ margin: '4px 0' }}><strong>Name:</strong> {session.user?.name || 'Not set'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
