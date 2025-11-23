import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';
import { useSession } from '@/lib/auth-client';

export default function Onboarding() {
    const { data: session } = useSession();
    const history = useHistory();
    const [aiLevel, setAiLevel] = useState('Beginner');
    const [codingLevel, setCodingLevel] = useState('Beginner');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/user/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send cookies
                body: JSON.stringify({ aiExperience: aiLevel, codingExperience: codingLevel })
            });
            if (res.ok) {
                // Get the referring page from URL params or default to home
                const urlParams = new URLSearchParams(window.location.search);
                const returnTo = urlParams.get('returnTo') || '/';

                // Add parameter to show personalized tab if returning to a chapter page
                const separator = returnTo.includes('?') ? '&' : '?';
                const redirectUrl = returnTo !== '/' ? `${returnTo}${separator}showPersonalized=true` : returnTo;

                // Force a page reload to refresh the session and personalization status
                window.location.href = redirectUrl;
            } else {
                alert('Failed to save preferences');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving preferences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Onboarding">
            <div className="container margin-vert--xl" style={{ maxWidth: '600px' }}>
                <h1 className="margin-bottom--lg">Personalize Your Experience</h1>
                <div className="card shadow--md">
                    <div className="card__body">
                        <form onSubmit={handleSubmit}>
                            <div className="margin-bottom--md">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                    What is your level of experience with AI?
                                </label>
                                <select
                                    value={aiLevel}
                                    onChange={e => setAiLevel(e.target.value)}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div className="margin-bottom--lg">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                    What is your level of experience with Coding?
                                </label>
                                <select
                                    value={codingLevel}
                                    onChange={e => setCodingLevel(e.target.value)}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <button type="submit" className="button button--primary button--block" disabled={loading}>
                                {loading ? 'Saving...' : 'Complete Setup'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
