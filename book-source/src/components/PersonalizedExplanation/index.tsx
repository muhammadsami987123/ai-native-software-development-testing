import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { usePageContent } from '@/hooks/usePageContent';

export default function PersonalizedExplanation() {
    const { data: session } = useSession();
    const { pageTitle, pagePath } = usePageContent();
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session && pageTitle) {
            fetchExplanation();
        }
    }, [session, pageTitle]);

    const fetchExplanation = async () => {
        setLoading(true);
        try {
            // Use credentials: include to send session cookie
            const res = await fetch('http://localhost:3001/api/explanation/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ pageTitle, pagePath })
            });
            const data = await res.json();
            setExplanation(data.explanation);
        } catch (e) {
            console.error(e);
            setExplanation('Failed to load explanation.');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="card margin-bottom--md">
                <div className="card__header">
                    <h3>Personalized Explanation</h3>
                </div>
                <div className="card__body">
                    <p>Please login to view personalized explanations.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card margin-bottom--md">
            <div className="card__header">
                <h3>Personalized Explanation</h3>
            </div>
            <div className="card__body">
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ifm-color-emphasis-600)' }}>
                        <div className="spinner" style={{
                            width: '30px',
                            height: '30px',
                            border: '3px solid var(--ifm-color-primary-light)',
                            borderTopColor: 'var(--ifm-color-primary)',
                            borderRadius: '50%',
                            margin: '0 auto 20px',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p>Generating personalized explanation for you...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <>
                        <div
                            className="personalized-content markdown"
                            dangerouslySetInnerHTML={{ __html: explanation }}
                        />
                        {explanation && (
                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                <button
                                    onClick={fetchExplanation}
                                    className="button button--sm button--outline button--primary"
                                >
                                    <i className="fas fa-sync-alt" style={{ marginRight: '8px' }}></i>
                                    Regenerate
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
