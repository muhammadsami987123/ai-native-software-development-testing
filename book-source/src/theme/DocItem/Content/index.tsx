import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { ThemeClassNames } from '@docusaurus/theme-common';
import AutoSummary from '@site/src/components/AutoSummary';
import PersonalizedExplanation from '@site/src/components/PersonalizedExplanation';
import { useBookmarks } from '@site/src/contexts/BookmarkContext';
import { usePageContent } from '@site/src/hooks/usePageContent';
import { useSession } from '@/lib/auth-client';
import type { Props } from '@theme/DocItem/Content';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';

function useSyntheticTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

const AuthRequiredMessage = ({ feature }: { feature: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderRadius: '12px',
    border: '1px solid var(--ifm-color-emphasis-200)',
    marginTop: '20px'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
    <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Authentication Required</h3>
    <p style={{ fontSize: '16px', color: 'var(--ifm-color-emphasis-600)', marginBottom: '24px' }}>
      Please sign in to access {feature}.
    </p>
    <Link to="/login" className="button button--primary button--lg">
      Sign In to Continue
    </Link>
  </div>
);

export default function DocItemContent({ children }: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const { isChapterPage, pagePath, pageTitle } = usePageContent();
  const doc = useDoc();
  const { setCurrentDoc } = useBookmarks();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'original' | 'summary' | 'personalized'>('original');
  const [hasCompletedPersonalization, setHasCompletedPersonalization] = useState(false);

  // Check if user has completed personalization questions
  useEffect(() => {
    const checkPersonalization = async () => {
      if (!session) {
        console.log('⚠️ No session, setting personalization to false');
        setHasCompletedPersonalization(false);
        return;
      }

      try {
        console.log('🔍 Checking personalization status...');
        const response = await fetch('http://localhost:3001/api/user/check-personalization', {
          credentials: 'include',
          cache: 'no-store'
        });
        const data = await response.json();
        console.log('✨ Personalization check result:', data);
        setHasCompletedPersonalization(data.completed);

        if (data.completed && isChapterPage) {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('showPersonalized') === 'true') {
            console.log('🎯 Auto-switching to personalized tab');
            setActiveTab('personalized');
            window.history.replaceState({}, '', window.location.pathname);
          }
        }
      } catch (error) {
        console.error('❌ Error checking personalization:', error);
        setHasCompletedPersonalization(false);
      }
    };

    checkPersonalization();
  }, [session, isChapterPage]);

  // Re-check personalization when switching to personalized tab
  useEffect(() => {
    if (activeTab === 'personalized' && session) {
      console.log('🔄 Personalized tab activated, re-checking status...');
      const recheckPersonalization = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/user/check-personalization', {
            credentials: 'include',
            cache: 'no-store'
          });
          const data = await response.json();
          console.log('✨ Re-check result:', data);
          setHasCompletedPersonalization(data.completed);
        } catch (error) {
          console.error('❌ Error re-checking personalization:', error);
        }
      };
      recheckPersonalization();
    }
  }, [activeTab, session]);

  // Publish current doc TOC and metadata to BookmarkContext
  useEffect(() => {
    setCurrentDoc({
      toc: doc.toc,
      metadata: {
        title: doc.metadata.title,
        permalink: doc.metadata.permalink,
      },
    });

    return () => {
      setCurrentDoc(null);
    };
  }, [doc.toc, doc.metadata.title, doc.metadata.permalink, setCurrentDoc]);

  const TabButton = ({
    id,
    label,
    icon,
    isLocked = false
  }: {
    id: 'original' | 'summary' | 'personalized',
    label: string,
    icon?: ReactNode,
    isLocked?: boolean
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      role="tab"
      aria-selected={activeTab === id}
      aria-pressed={activeTab === id}
      data-active={activeTab === id}
      className={clsx('button', 'doc-tab', {
        'doc-tab--active': activeTab === id,
        'button--primary': activeTab === id,
        'button--secondary': activeTab !== id,
      })}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '8px',
        border: activeTab === id ? '2px solid var(--ifm-color-primary)' : '2px solid transparent',
        transition: 'all 0.2s ease',
        opacity: activeTab !== id ? 0.7 : 1,
        fontWeight: activeTab === id ? 'bold' : '500',
        transform: activeTab === id ? 'scale(1.02)' : 'scale(1)',
        boxShadow: activeTab === id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      {icon}
      {label}
      {isLocked && <span style={{ fontSize: '12px', marginLeft: '4px' }}>🔒</span>}
    </button>
  );

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}

      {isChapterPage ? (
        <div className="doc-content-tabs">
          <div role="tablist" aria-label="Document view tabs" style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            padding: '4px',
            backgroundColor: 'var(--ifm-color-emphasis-100)',
            borderRadius: '12px',
            width: 'fit-content'
          }}>
            <TabButton
              id="original"
              label="Original"
              icon={<i className="fas fa-file-alt"></i>}
            />
            <TabButton
              id="summary"
              label="Summary"
              icon={<i className="fas fa-magic"></i>}
              isLocked={!session}
            />
            <TabButton
              id="personalized"
              label="Personalized"
              icon={<i className="fas fa-user-check"></i>}
              isLocked={!session || !hasCompletedPersonalization}
            />
          </div>

          <div className="tab-content">
            {activeTab === 'original' && (
              <div className="animation-fade-in">
                <MDXContent>{children}</MDXContent>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="animation-fade-in">
                {session ? (
                  <AutoSummary pagePath={pagePath} pageTitle={pageTitle} />
                ) : (
                  <AuthRequiredMessage feature="summarized content" />
                )}
              </div>
            )}

            {activeTab === 'personalized' && (
              <div className="animation-fade-in">
                {!session ? (
                  <AuthRequiredMessage feature="personalized content" />
                ) : !hasCompletedPersonalization ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    textAlign: 'center',
                    backgroundColor: 'var(--ifm-background-surface-color)',
                    borderRadius: '12px',
                    border: '1px solid var(--ifm-color-emphasis-200)',
                    marginTop: '20px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚙️</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Personalization Setup Required</h3>
                    <p style={{ fontSize: '16px', color: 'var(--ifm-color-emphasis-600)', marginBottom: '24px', maxWidth: '500px' }}>
                      Please complete the personalization setup before accessing this feature.
                      This helps us tailor the content to your experience level.
                    </p>
                    <Link
                      to={`/onboarding?returnTo=${encodeURIComponent(window.location.pathname)}`}
                      className="button button--primary button--lg"
                    >
                      Complete Setup Now
                    </Link>
                  </div>
                ) : (
                  <PersonalizedExplanation />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <MDXContent>{children}</MDXContent>
      )}
    </div>
  );
}
