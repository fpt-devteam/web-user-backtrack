export function CharacterIllustration() {
  return (
    // absolute on mobile (top-right of hero), in-flow on desktop
    <div className="absolute top-5 right-5 lg:static">
      <div className="rotate-6 w-36 h-36 lg:w-60 lg:h-60 rounded-2xl lg:rounded-3xl bg-amber-100 shadow-2xl flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 120 130"
          className="w-28 h-28 lg:w-52 lg:h-52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <ellipse cx="55" cy="72" rx="30" ry="34" fill="#F5C842" />
          {/* Eyes */}
          <circle cx="46" cy="63" r="3.5" fill="#2d2d2d" />
          <circle cx="64" cy="63" r="3.5" fill="#2d2d2d" />
          {/* Smile */}
          <path d="M47 77 Q55 85 63 77" stroke="#2d2d2d" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left arm */}
          <path d="M28 75 Q16 68 18 57" stroke="#F5C842" strokeWidth="7" strokeLinecap="round" />
          {/* Right arm holding magnifying glass */}
          <path d="M82 68 Q93 58 88 46" stroke="#F5C842" strokeWidth="7" strokeLinecap="round" />
          {/* Magnifying glass lens */}
          <circle cx="84" cy="40" r="12" stroke="#555" strokeWidth="3" />
          {/* Magnifying glass handle */}
          <line x1="93" y1="49" x2="103" y2="59" stroke="#555" strokeWidth="3.5" strokeLinecap="round" />
          {/* Legs */}
          <path d="M45 104 Q42 116 39 126" stroke="#F5C842" strokeWidth="7" strokeLinecap="round" />
          <path d="M65 104 Q68 116 71 126" stroke="#F5C842" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
