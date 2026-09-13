import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className="back-to-top-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {/* Floating Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="back-to-top-btn"
        aria-label="Back to top"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-full, 9999px)',
          backgroundColor: 'var(--accent, #c85a32)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 16px rgba(200, 90, 50, 0.35), 0 2px 6px rgba(0, 0, 0, 0.12)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
