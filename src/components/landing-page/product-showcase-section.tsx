const ITEMS = [
  '🔑 Keys',
  '⚡ Chargers',
  '🎒 Backpacks',
  '📱 Phones',
  '💻 Laptops',
  '🚲 Bicycles',
  '📷 Cameras',
  '🛴 Scooters',
  '👜 Bags',
  '📄 Documents',
  '🎧 Headphones',
  '⌚ Watches',
  '🔧 Tools',
  '💼 Luggage',
]

// Duplicate for seamless infinite loop
const MARQUEE_ITEMS = [...ITEMS, ...ITEMS]

export function ProductShowcaseSection() {
  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Marquee ticker */}
      <div
        className="w-full overflow-hidden"
        style={{ backgroundColor: '#111110', padding: '12px 0' }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0',
            width: 'max-content',
            animation: 'marquee-scroll 28s linear infinite',
          }}
        >
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                padding: '0 28px',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Product collage image */}
      <img
        src="/product-showcase.jpg"
        alt="Backtrack – bảo vệ mọi thứ bạn trân trọng"
        className="w-full object-cover object-center"
        style={{ maxHeight: '3500px' }}
        draggable={false}
      />
    </div>
  )
}
