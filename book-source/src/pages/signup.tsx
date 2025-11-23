import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { signIn, signUp } from '@/lib/auth-client';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    const handleGoogleSignUp = async () => {
        await signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3000/onboarding"
        });
    };

    const handleGithubSignUp = async () => {
        await signIn.social({
            provider: "github",
            callbackURL: "http://localhost:3000/onboarding"
        });
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signUp.email({
                email,
                password,
                name,
                callbackURL: "http://localhost:3000/onboarding"
            }, {
                onSuccess: () => {
                    history.push('/onboarding');
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                    setLoading(false);
                }
            });
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
            setLoading(false);
        }
    };

    return (
        <Layout title="Sign Up" description="Create an account">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 60px)', // Adjust for navbar
                background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: '#1b1b1d',
                    padding: '40px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    width: '100%',
                    maxWidth: '400px',
                    color: '#fff'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#fff' }}>Create Account</h1>
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>Join to access personalized AI features</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        <button
                            onClick={handleGithubSignUp}
                            className="button button--block"
                            style={{
                                backgroundColor: '#24292e',
                                color: '#fff',
                                border: '1px solid #3e444a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                padding: '12px'
                            }}
                        >
                            <i className="fa-brands fa-github" style={{ fontSize: '1.2rem' }}></i>
                            Sign up with GitHub
                        </button>
                        <button
                            onClick={handleGoogleSignUp}
                            className="button button--block"
                            style={{
                                backgroundColor: '#24292e',
                                color: '#fff',
                                border: '1px solid #3e444a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                padding: '12px'
                            }}
                        >
                            <span style={{ fontWeight: 'bold', color: '#EA4335' }}>G</span>
                            Sign up with Google
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '20px 0',
                        color: '#666'
                    }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
                        <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>or</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
                    </div>

                    <form onSubmit={handleEmailSignUp}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="auth-input"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="auth-input"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="auth-input"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {error && <p style={{ color: '#ff6b6b', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="button button--primary button--block"
                            style={{
                                padding: '12px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)',
                                border: 'none'
                            }}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                            Already have an account? <Link to="/login" style={{ color: '#a29bfe' }}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
