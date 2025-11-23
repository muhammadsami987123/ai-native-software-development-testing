import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { marked } from 'marked';

interface AutoSummaryProps {
    pagePath: string;
    pageTitle: string;
}

export default function AutoSummary({ pagePath, pageTitle }: AutoSummaryProps) {
    const { data: session } = useSession();
    const [summary, setSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_BASE = 'http://localhost:3001/api/summary';

    // Auto-generate summary when component mounts
    useEffect(() => {
        if (session && pageTitle && pagePath) {
            generateSummary();
        }
    }, [session, pageTitle, pagePath]);

    const generateSummary = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // First check if summary exists
            const checkResponse = await fetch(
                `${API_BASE}/check?pagePath=${encodeURIComponent(pagePath)}&size=long`
            );
            const checkData = await checkResponse.json();

            if (checkData.exists && checkData.summary) {
                console.log('📦 Using cached summary');
                setSummary(checkData.summary);
                setIsLoading(false);
                return;
            }

            // Generate new summary
            console.log('🔄 Generating new summary...');
            const response = await fetch(`${API_BASE}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pagePath,
                    pageTitle,
                    size: 'long', // Always use long/detailed summary
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate summary');
            }

            const data = await response.json();
            setSummary(data.summary);
        } catch (err) {
            console.error('Error generating summary:', err);
            setError('Failed to generate summary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Please sign in to view summaries.</p>
            </div>
        );
    }

    return (
        <div className="card margin-bottom--md">
            <div className="card__header">
                <h3>📝 Summary</h3>
            </div>
            <div className="card__body">
                {isLoading ? (
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
                        <p>Generating detailed summary...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : error ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
                        <p>{error}</p>
                        <button
                            onClick={generateSummary}
                            className="button button--sm button--primary"
                            style={{ marginTop: '16px' }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : summary ? (
                    <>
                        <div
                            className="markdown"
                            dangerouslySetInnerHTML={{ __html: marked(summary) }}
                        />
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button
                                onClick={generateSummary}
                                className="button button--sm button--outline button--primary"
                            >
                                <i className="fas fa-sync-alt" style={{ marginRight: '8px' }}></i>
                                Regenerate
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p>No summary available.</p>
                        <button
                            onClick={generateSummary}
                            className="button button--sm button--primary"
                            style={{ marginTop: '16px' }}
                        >
                            Generate Summary
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
