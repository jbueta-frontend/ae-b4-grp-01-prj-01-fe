import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function ScrollHint({
  direction = 'horizontal',
  label = 'Swipe to explore',
  targetRef = null,
  className = 'mobile-only',
  style = {},
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!targetRef || !targetRef.current) return;

    const element = targetRef.current;
    const handleScroll = () => {
      const scrollPos = direction === 'horizontal' ? element.scrollLeft : element.scrollTop;
      if (scrollPos > 30) {
        setVisible(false);
      }
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [targetRef, direction]);

  if (!visible) return null;

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={`scroll-hint-indicator ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full, 9999px)',
        backgroundColor: 'rgba(24, 24, 27, 0.72)',
        backdropFilter: 'blur(6px)',
        color: '#ffffff',
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        userSelect: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        animation: 'fadeIn 0.3s ease-out',
        ...style,
      }}
    >
      <span>{label}</span>
      {isHorizontal ? (
        <ChevronRight size={12} className="scroll-hint-pulse-h" />
      ) : (
        <ChevronDown size={12} className="scroll-hint-pulse-v" />
      )}
    </div>
  );
}
