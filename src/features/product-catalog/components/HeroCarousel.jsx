import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'slide-wooden',
    tag: 'Hot Deal of This Week',
    tagColor: 'var(--accent)',
    headline: ['Architect Beechwood', 'Block Set'],
    description:
      'Zero microplastics, zero screens. 50 precision-milled architectural shapes carved from sustainable German beechwood with organic beeswax seals.',
    priceText: 'From',
    price: '₱48.00',
    cutoutImage: '/hero-wooden-blocks.png',
    secondaryBadge: {
      name: 'Sensory Fox Plush',
      price: '₱34.00',
      image: '/hero-plush-fox.png',
      targetIndex: 2,
    },
    rating: '4.9',
    reviewCount: '142+ Reviews',
    category: 'Wooden',
    ambientGlow: 'rgba(200, 90, 50, 0.12)',
  },
  {
    id: 'slide-stem',
    tag: 'Award-Winning Robotics',
    tagColor: '#2563EB',
    headline: ['Modular STEM', 'Robotics Explorer'],
    description:
      'Magnetic click-and-run gear motors with analog sensor modules. Teaches kinetic movement and circuit logic through analog, screen-free tactile exploration.',
    priceText: 'From',
    price: '₱85.00',
    cutoutImage: '/hero-stem-robotics.png',
    secondaryBadge: {
      name: 'Nordic Balance Board',
      price: '₱72.00',
      image: '/hero-balance-board.png',
      targetIndex: 3,
    },
    rating: '4.8',
    reviewCount: '96+ Reviews',
    category: 'STEM',
    ambientGlow: 'rgba(37, 99, 235, 0.10)',
  },
  {
    id: 'slide-plush',
    tag: 'Organic Newborn Heirloom',
    tagColor: '#B45309',
    headline: ['Sensory Fox', 'Organic Linen Plush'],
    description:
      'Stitched from raw unbleached European flax linen with hypoallergenic cornfiber fill. Gently weighted with soothing natural lavender blossom pouches.',
    priceText: 'From',
    price: '₱34.00',
    cutoutImage: '/hero-plush-fox.png',
    secondaryBadge: {
      name: 'Architect Beechwood',
      price: '₱48.00',
      image: '/hero-wooden-blocks.png',
      targetIndex: 0,
    },
    rating: '5.0',
    reviewCount: '68+ Reviews',
    category: 'Plush',
    ambientGlow: 'rgba(180, 83, 9, 0.12)',
  },
  {
    id: 'slide-balance',
    tag: 'Montessori Classic',
    tagColor: '#059669',
    headline: ['Curved Nordic', 'Birch Balance Board'],
    description:
      'Multi-layer Baltic Birch curved rocker board. Functions as an arch bridge, slide, balancing rocker, or quiet reading lounger. Supports up to 220 lbs.',
    priceText: 'From',
    price: '₱72.00',
    cutoutImage: '/hero-balance-board.png',
    secondaryBadge: {
      name: 'Modular STEM Rover',
      price: '₱85.00',
      image: '/hero-stem-robotics.png',
      targetIndex: 1,
    },
    rating: '4.9',
    reviewCount: '110+ Reviews',
    category: 'Wooden',
    ambientGlow: 'rgba(5, 150, 105, 0.10)',
  },
];

export default function HeroCarousel({ onSelectCategory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const currentSlide = HERO_SLIDES[currentIndex];

  const goToSlide = (index) => {
    if (index === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 450);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  const handleShopNow = () => {
    if (onSelectCategory) {
      onSelectCategory(currentSlide.category);
    }
    const productsEl = document.getElementById('products');
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        padding: '56px 0 68px',
        borderBottom: '1px solid var(--border-hairline)',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Dynamic Ambient Background Glow matching active toy */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '8%',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${currentSlide.ambientGlow} 0%, rgba(250, 247, 245, 0) 70%)`,
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
            minHeight: '440px',
          }}
        >
          {/* ================================================================= */}
          {/* Left Column: Eyebrow, Dynamic Titles, Subtitle, Shop CTA & Rating */}
          {/* ================================================================= */}
          <div
            key={currentSlide.id + '-content'}
            style={{
              animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Eyebrow Tag with Circular Dot Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: currentSlide.tagColor,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-hairline)',
                backdropFilter: 'blur(6px)',
                marginBottom: '18px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: currentSlide.tagColor,
                  display: 'inline-block',
                }}
              />
              <span>{currentSlide.tag}</span>
            </div>

            {/* Headline: 2-Line Bold Title */}
            <h1
              style={{
                fontSize: 'clamp(2.35rem, 5vw, 3.6rem)',
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

            {/* Description */}
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                maxWidth: '460px',
                marginBottom: '32px',
              }}
            >
              {currentSlide.description}
            </p>

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
                  fontSize: '0.9375rem',
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
                      fontSize: '0.75rem',
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
          {/* Right Column: Transparent Floating Product (Toy) Display Only     */}
          {/* (No square box, pure toy cutout with soft natural drop shadow)    */}
          {/* ================================================================= */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
            }}
          >
            {/* Pure Product Cutout Image (Transparent background, floating) */}
            <div
              key={currentSlide.id + '-image'}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                height: '380px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src={currentSlide.cutoutImage}
                alt={currentSlide.headline.join(' ')}
                style={{
                  maxHeight: '360px',
                  maxWidth: '92%',
                  objectFit: 'contain',
                  filter:
                    'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.16)) drop-shadow(0 8px 14px rgba(0, 0, 0, 0.08))',
                  transition: 'transform 0.4s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    'scale(1.04) translateY(-4px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1) translateY(0)')
                }
                onClick={handleShopNow}
              />
            </div>

            {/* Floating Circular Price Tag Badge (Matching reference eTrade "$48.00" circle) */}
            <div
              key={currentSlide.id + '-price'}
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                zIndex: 4,
                width: '82px',
                height: '82px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-hairline)',
                animation: 'pulse 3s infinite ease-in-out',
                cursor: 'pointer',
              }}
              onClick={handleShopNow}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                {currentSlide.priceText}
              </span>
              <span
                style={{
                  fontSize: '1.1875rem',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  lineHeight: 1.2,
                }}
              >
                {currentSlide.price}
              </span>
            </div>

            {/* Secondary Floating Accessory Preview Badge (Clickable to switch slide) */}
            <div
              onClick={() => goToSlide(currentSlide.secondaryBadge.targetIndex)}
              style={{
                position: 'absolute',
                bottom: '-10px',
                right: '10px',
                zIndex: 4,
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                border: '1px solid var(--border-hairline)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 14px 32px rgba(0, 0, 0, 0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 12px 28px rgba(0, 0, 0, 0.12)';
              }}
              title="Click to view next featured heirloom"
            >
              <img
                src={currentSlide.secondaryBadge.image}
                alt={currentSlide.secondaryBadge.name}
                style={{
                  width: '38px',
                  height: '38px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                >
                  {currentSlide.secondaryBadge.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                  }}
                >
                  {currentSlide.secondaryBadge.price} →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Bottom Interactive Navigation: Arrows, Dash Indicators, & Previews */}
        {/* ================================================================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(24, 24, 27, 0.06)',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Prev / Next Arrow Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={prevSlide}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-hairline)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)',
              }}
              aria-label="Previous featured toy"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextSlide}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-hairline)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)',
              }}
              aria-label="Next featured toy"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dash Indicator Pills (Matching Reference layout) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  style={{
                    width: isActive ? '34px' : '10px',
                    height: '5px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive
                      ? 'var(--accent)'
                      : 'rgba(24, 24, 27, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  aria-label={`Go to slide ${idx + 1}: ${slide.headline.join(' ')}`}
                />
              );
            })}
          </div>

          {/* Interactive Mini-Thumbnail Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px 4px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    border: isActive
                      ? '1px solid var(--accent)'
                      : '1px solid transparent',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  title={slide.headline.join(' ')}
                >
                  <img
                    src={slide.cutoutImage}
                    alt={slide.headline.join(' ')}
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    {slide.headline[0].split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
