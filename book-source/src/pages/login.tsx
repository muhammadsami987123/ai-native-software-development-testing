import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { signIn } from '@/lib/auth-client';
import Link from '@docusaurus/Link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        await signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3000/"
        });
    };

    const handleGithubSignIn = async () => {
        await signIn.social({
            provider: "github",
            callbackURL: "http://localhost:3000/"
        });
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await signIn.email({
                email,
                password,
                callbackURL: "http://localhost:3000/"
            }, {
                onError: (ctx) => {
                    console.error('Login error:', ctx.error);
                    setError(ctx.error.message || 'Invalid email or password');
                    setLoading(false);
                },
                onSuccess: () => {
                    // Redirect will happen automatically via callbackURL
                    setLoading(false);
                }
            });
        } catch (err: any) {
            console.error('Login exception:', err);
            setError(err.message || 'Invalid email or password. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Layout title="Sign In" description="Sign in to AI Native Book">
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
                        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#fff' }}>Welcome Back</h1>
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>Sign in to access personalized content</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        <button
                            onClick={handleGithubSignIn}
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
                            Continue with GitHub
                        </button>
                        <button
                            onClick={handleGoogleSignIn}
                            className="button button--block"
                            style={{
                                backgroundColor: '#24292e', // Dark background for consistency
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
                            Continue with Google
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

                    <form onSubmit={handleEmailSignIn}>
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
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                            Don't have an account? <Link to="/signup" style={{ color: '#a29bfe' }}>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
