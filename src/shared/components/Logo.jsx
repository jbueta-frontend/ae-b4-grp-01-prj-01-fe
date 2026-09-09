import { Link } from 'react-router-dom';

export default function Logo({
  size = 'md',
  showText = true,
  clickable = true,
  className = '',
  textStyle = {},
}) {
  // Height in pixels based on size preset
  const sizeMap = {
    xs: 24,
    sm: 30,
    md: 38,
    lg: 48,
    xl: 64,
  };

  const pixelHeight = typeof size === 'number' ? size : sizeMap[size] || 38;

  const content = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: pixelHeight >= 38 ? '10px' : '8px',
        userSelect: 'none',
        verticalAlign: 'middle',
      }}
    >
      <img
        src="/brand-logo.png"
        alt="FiddleMania Logo"
        width={Math.round(pixelHeight * 0.828)}
        height={pixelHeight}
        style={{
          height: `${pixelHeight}px`,
          width: 'auto',
          maxHeight: '100%',
          objectFit: 'contain',
          display: 'block',
          imageRendering: '-webkit-optimize-contrast',
        }}
        loading="eager"
      />

      {showText && (
        <span
          style={{
            fontSize:
              pixelHeight >= 48
                ? '1.5rem'
                : pixelHeight >= 38
                  ? '1.25rem'
                  : '1.0625rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            ...textStyle,
          }}
        >
          <span>FIDDLEMANIA</span>
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              display: 'inline-block',
            }}
          />
        </span>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
        {content}
      </Link>
    );
  }

  return content;
}
