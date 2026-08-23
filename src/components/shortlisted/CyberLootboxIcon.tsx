'use client';

interface CyberLootboxIconProps {
  isOpen: boolean;
  isOpening?: boolean;
  isHovered?: boolean;
}

export function CyberLootboxIcon({ isOpen, isOpening, isHovered }: CyberLootboxIconProps) {
  const primaryStroke = isHovered ? '#ff5fcf' : '#9929ea';
  const secondaryStroke = isHovered ? '#faeb92' : '#ff5fcf';
  const accentFill = isHovered ? 'rgba(255, 95, 207, 0.45)' : 'rgba(153, 41, 234, 0.3)';

  return (
    <div
      style={{
        position: 'relative',
        width: '54px',
        height: '54px',
        display: 'grid',
        placeItems: 'center',
        filter: isHovered
          ? 'drop-shadow(0 0 16px rgba(255, 95, 207, 0.95)) drop-shadow(0 0 24px rgba(153, 41, 234, 0.9))'
          : isOpen
          ? 'drop-shadow(0 0 12px rgba(255, 95, 207, 0.75)) drop-shadow(0 0 20px rgba(153, 41, 234, 0.8))'
          : 'drop-shadow(0 0 8px rgba(153, 41, 234, 0.6))',
        transition: 'all 0.15s ease',
      }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          transform: isOpening ? 'scale(1.15) rotate(-4deg)' : isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <defs>
          <linearGradient id="purpleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5fcf" />
            <stop offset="50%" stopColor="#9929ea" />
            <stop offset="100%" stopColor="#faeb92" />
          </linearGradient>

          <radialGradient id="purpleBurst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#faeb92" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#ff5fcf" stopOpacity="0.75" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {isOpen ? (
          /* ================= OPENED CYBER CHEST ================= */
          <g>
            {/* Energy Core Burst */}
            <circle cx="32" cy="26" r="14" fill="url(#purpleBurst)" />

            {/* Bottom Chest Body */}
            <polygon
              points="32,32 52,22 52,44 32,54"
              fill="rgba(20, 5, 36, 0.9)"
              stroke={primaryStroke}
              strokeWidth="1.6"
            />
            <polygon
              points="32,32 12,22 12,44 32,54"
              fill="rgba(10, 2, 20, 0.9)"
              stroke={secondaryStroke}
              strokeWidth="1.6"
            />
            <polygon
              points="32,54 52,44 32,32 12,44"
              fill={accentFill}
              stroke="#faeb92"
              strokeWidth="1.2"
            />

            {/* Open Lid (Tilted Upwards) */}
            <g transform="translate(0, -12)">
              <polygon
                points="12,22 4,10 24,4 32,16"
                fill="rgba(255, 95, 207, 0.4)"
                stroke="#ff5fcf"
                strokeWidth="1.6"
              />
              <polygon
                points="32,16 40,4 60,10 52,22"
                fill="rgba(153, 41, 234, 0.4)"
                stroke="#9929ea"
                strokeWidth="1.6"
              />
            </g>

            {/* Center Sparks */}
            <circle cx="32" cy="26" r="2.8" fill="#faeb92" />
            <line x1="32" y1="24" x2="32" y2="8" stroke="#faeb92" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="32" cy="54" r="1.8" fill="#ff5fcf" />
          </g>
        ) : (
          /* ================= CLOSED CYBER CHEST ================= */
          <g>
            {/* Base Body */}
            <polygon
              points="32,30 52,20 52,42 32,52"
              fill="rgba(20, 5, 36, 0.92)"
              stroke={primaryStroke}
              strokeWidth="1.6"
            />
            <polygon
              points="32,30 12,20 12,42 32,52"
              fill="rgba(10, 2, 20, 0.92)"
              stroke={secondaryStroke}
              strokeWidth="1.6"
            />
            {/* Top Lid */}
            <polygon
              points="32,10 52,20 32,30 12,20"
              fill={accentFill}
              stroke="#faeb92"
              strokeWidth="1.6"
            />

            {/* Geometric Trim Lines */}
            <line x1="32" y1="10" x2="32" y2="52" stroke={primaryStroke} strokeWidth="1.4" strokeDasharray="3 2" />
            <line x1="12" y1="20" x2="52" y2="20" stroke={secondaryStroke} strokeWidth="1.2" opacity="0.8" />

            {/* Golden Lock Emblem */}
            <rect
              x="29"
              y="26"
              width="6"
              height="8"
              rx="1"
              fill="#05020a"
              stroke="#faeb92"
              strokeWidth="1.4"
            />
            <circle cx="32" cy="29" r="1" fill={isHovered ? '#ff5fcf' : '#faeb92'} />

            {/* Neon Corner Accents */}
            <circle cx="32" cy="10" r="1.8" fill="#faeb92" />
            <circle cx="12" cy="20" r="1.8" fill="#ff5fcf" />
            <circle cx="52" cy="20" r="1.8" fill="#9929ea" />
            <circle cx="32" cy="52" r="2" fill="#faeb92" />
          </g>
        )}
      </svg>
    </div>
  );
}
