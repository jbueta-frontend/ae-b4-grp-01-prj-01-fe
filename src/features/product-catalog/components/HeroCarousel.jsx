import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Star } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'slide-rally-truck',
    tag: 'All-Terrain Adventure Series',
    headline: ['Off-Road Desert', 'Rally Truck'],
    description:
      'Rugged rally buggy engineered with working 4x4 spring suspension, heavy-duty all-terrain tread tires, and full cockpit roll cage.',
    cutoutImage: '/products/desert_rally_truck.jpg',
    rating: '4.9',
    reviewCount: '184+ Reviews',
    category: 'Building Sets',
  },
  {
    id: 'slide-zen-pagoda',
    tag: 'Architectural Heritage Masterpiece',
    headline: ['Japanese Zen', 'Garden Pagoda'],
    description:
      'Tranquil architectural model featuring blossoming cherry trees, traditional stone lanterns, arched bridges, and a tiered timber pagoda.',
    cutoutImage: '/products/zen_garden_pagoda.jpg',
    rating: '5.0',
    reviewCount: '210+ Reviews',
    category: 'Building Sets',
  },
  {
    id: 'slide-cargo-freight',
    tag: 'Maritime Engineering Classic',
    headline: ['Ocean Harbor', 'Cargo Freight'],
    description:
      'Realistically detailed modular container vessel featuring a working 360-degree crane hoist, dockside forklift, and interchangeable shipping crates.',
    cutoutImage: '/products/ocean_cargo_ship.jpg',
    rating: '4.9',
    reviewCount: '146+ Reviews',
    category: 'Building Sets',
  },
];

export default function HeroCarousel({ onSelectCategory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Countdown timer state integrated into hero
  const [timeLeft, setTimeLeft] = useState({
    days: 16,
    hours: 10,
    mins: 56,
    secs: 54,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { ...prev, mins: 59, secs: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            mins: 59,
            secs: 59,
          };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic slide rotation without manual user arrows (faster by 3s: 2000ms)
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  const currentSlide = HERO_SLIDES[currentIndex];

  const handleShopNow = () => {
    if (onSelectCategory) {
      onSelectCategory(currentSlide.category);
    }
    const productsEl = document.getElementById('products');
    if (productsEl) {
      const navHeight = 58;
      const targetY =
        productsEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        background:
          'linear-gradient(135deg, #FAF7F5 0%, #F5EDE6 60%, #EFE5DC 100%)',
        padding: '48px 0 42px',
        borderBottom: '1px solid var(--border-hairline)',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Subtle Ambient Background Glow matching brand accent */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '8%',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(200, 90, 50, 0.10) 0%, rgba(250, 247, 245, 0) 70%)',
          transition: 'background 0.8s ease',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            minHeight: '420px',
          }}
        >
          {/* ================================================================= */}
          {/* Left Column: Eyebrow, Dynamic Titles, Don't Miss Countdown & CTA  */}
          {/* ================================================================= */}
          <div
            key={currentSlide.id + '-content'}
            className="hero-smooth-animate"
          >
            {/* Eyebrow Tag - Branded Terracotta Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'var(--font-small, 14px)',
                fontWeight: 700,
                color: 'var(--accent)',
                backgroundColor: 'rgba(200, 90, 50, 0.08)',
                border: '1px solid rgba(200, 90, 50, 0.25)',
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                backdropFilter: 'blur(6px)',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  display: 'inline-block',
                }}
              />
              <span>{currentSlide.tag}</span>
            </div>

            {/* Headline: 2-Line Bold Title (H1: 64px) */}
            <h1
              style={{
                fontSize: 'var(--font-h1-fluid, 64px)',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              {currentSlide.headline[0]} <br />
              <span style={{ color: 'var(--accent)' }}>
                {currentSlide.headline[1]}
              </span>
            </h1>

            {/* Description (Body: 18px) */}
            <p
              style={{
                fontSize: 'var(--font-body, 18px)',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: '480px',
                marginBottom: '24px',
              }}
            >
              {currentSlide.description}
            </p>

            {/* Integrated "Don't Miss!!" Countdown Timer Container */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid #D4CCC4',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 18px',
                marginBottom: '26px',
                maxWidth: '420px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'var(--font-small, 14px)',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    display: 'inline-block',
                  }}
                />
                <span>Don't Miss Out! Limited Drop Deal</span>
              </div>

              {/* 4 Countdown Unit Boxes */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCD5CF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {timeLeft.days}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginTop: '3px',
                    }}
                  >
                    Day
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCD5CF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {timeLeft.hours}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginTop: '3px',
                    }}
                  >
                    Hrs
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCD5CF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {timeLeft.mins}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginTop: '3px',
                    }}
                  >
                    Min
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCD5CF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {timeLeft.secs}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginTop: '3px',
                    }}
                  >
                    Sec
                  </span>
                </div>
              </div>
            </div>

            {/* Action Row: Shop Now CTA Button + Review Social Proof Cluster */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '24px',
              }}
            >
              <button
                onClick={handleShopNow}
                className="btn btn-primary"
                style={{
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(200, 90, 50, 0.35)',
                  cursor: 'pointer',
                }}
              >
                <ShoppingBag size={18} />
                <span>Shop Now</span>
              </button>

              {/* Social Proof Avatar Stack + 5 Stars */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Customer 1"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      border: '2px solid #FFFFFF',
                      objectFit: 'cover',
                    }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Customer 2"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      border: '2px solid #FFFFFF',
                      marginLeft: '-10px',
                      objectFit: 'cover',
                    }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Customer 3"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      border: '2px solid #FFFFFF',
                      marginLeft: '-10px',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                <div>
                  <div
                    style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-small, 14px)',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                    }}
                  >
                    {currentSlide.reviewCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* Right Column: Prominently Scaled Hero Product Showcase            */}
          {/* ================================================================= */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '440px',
            }}
          >
            {/* Prominent Scaled Toy Showcase Image */}
            <div
              key={currentSlide.id + '-image'}
              className="hero-smooth-animate"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                height: '440px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={currentSlide.cutoutImage}
                alt={currentSlide.headline.join(' ')}
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '430px',
                  objectFit: 'cover',
                  borderRadius: '28px',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  boxShadow:
                    '0 24px 50px rgba(0, 0, 0, 0.14), 0 6px 18px rgba(0, 0, 0, 0.06)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  'scale(1.025) translateY(-3px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1) translateY(0)')
                }
                onClick={handleShopNow}
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Minimized Automatic Pagination Indicator (No Arrows, No Thumbnails)*/}
        {/* ================================================================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '28px',
          }}
          aria-label="Carousel slide indicator"
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id}
                style={{
                  width: isActive ? '28px' : '8px',
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive
                    ? 'var(--accent)'
                    : 'rgba(24, 24, 27, 0.18)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                title={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
