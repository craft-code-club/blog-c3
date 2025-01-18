export default function Logo({ className = "", width = 40, height = 40 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_1_2)">
        {/* Background shape */}
        <path
          d="M900 500c0 220.914-179.086 400-400 400S100 720.914 100 500s179.086-400 400-400 400 179.086 400 400z"
          fill="#0F172A"
        />
        
        {/* Left hammer */}
        <path
          d="M350 300c-20 0-40 10-40 30v50l-60 30v80l60 30v180c0 20 20 30 40 30h60c20 0 40-10 40-30V300h-100z"
          fill="#0EA5E9"
        />
        
        {/* Right hammer */}
        <path
          d="M650 300c20 0 40 10 40 30v50l60 30v80l-60 30v180c0 20-20 30-40 30h-60c-20 0-40-10-40-30V300h100z"
          fill="#0EA5E9"
        />
        
        {/* Left sword */}
        <path
          d="M400 400c-20 0-40 10-40 30v240c0 20 20 30 40 30h60c20 0 40-10 40-30V430c0-20-20-30-40-30h-60z"
          fill="#8B5CF6"
        />
        
        {/* Right sword */}
        <path
          d="M600 400c20 0 40 10 40 30v240c0 20-20 30-40 30h-60c-20 0-40-10-40-30V430c0-20 20-30 40-30h60z"
          fill="#8B5CF6"
        />
        
        {/* Center decorative elements */}
        <path
          d="M450 500c-20 0-40 10-40 30v40c0 20 20 30 40 30h100c20 0 40-10 40-30v-40c0-20-20-30-40-30H450z"
          fill="#EC4899"
        />
        
        {/* Top decorative dot */}
        <circle cx="500" cy="280" r="15" fill="#EC4899" />
        
        {/* Circuit patterns */}
        <path
          d="M460 250v20M500 250v20M540 250v20"
          stroke="#EC4899"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M350 400h20M350 450h20M350 500h20"
          stroke="#0EA5E9"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M630 400h20M630 450h20M630 500h20"
          stroke="#0EA5E9"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <path fill="#fff" d="M100 100h800v800h-800z" />
        </clipPath>
      </defs>
    </svg>
  );
} 