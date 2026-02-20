import { useState } from "react";

export default function Landing({ navigate }) {
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      navigate("/scanner", { state: { name: name.trim() } });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Gradient background - EXACT November colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C4E17F] via-[#FFE66D] via-[#FF9A56] via-[#FF6B9D] to-[#C471F5]"></div>
      
      {/* Multi-layer gradient blobs for depth */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[200px] bg-[#C4E17F] opacity-60 animate-blob"></div>
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[180px] bg-[#FFE66D] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] bg-[#FF9A56] opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full blur-[180px] bg-[#FF6B9D] opacity-70 animate-blob animation-delay-6000"></div>
        <div className="absolute bottom-0 left-0 w-[650px] h-[650px] rounded-full blur-[170px] bg-[#C471F5] opacity-60 animate-blob animation-delay-8000"></div>
      </div>

      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px'
        }}
      ></div>

      {/* Main content - CENTERED */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 flex flex-col items-center">
        
        {/* Title - PERFECTLY CENTERED */}
        <div className="w-full flex justify-center mb-1 animate-fade-in-down">
          <h1 
            className="text-7xl md:text-8xl lg:text-[140px] text-white leading-[0.85] text-center"
            style={{ 
              fontFamily: "'Shrikhand', cursive",
              textShadow: '4px 4px 0px rgba(0,0,0,0.1)',
              letterSpacing: '0.02em'
            }}
          >
            FLAGGED
          </h1>
        </div>

        {/* Subtitle - CENTERED */}
        <p 
          className="text-lg md:text-xl text-white/95 mb-10 font-light tracking-wide text-center animate-fade-in-up"
          style={{ 
            fontFamily: "'Poppins', sans-serif",
            textShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontWeight: '400'
          }}
        >
          Scan the vibes before you fall.
        </p>

        {/* Input and button form - CENTERED */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 animate-fade-in-up animation-delay-200">
          
          {/* Name input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required
              className={`w-full px-7 py-4 rounded-full text-base text-gray-700 placeholder-gray-400 bg-white/45 backdrop-blur-xl border-2 transition-all duration-300 outline-none ${
                isFocused 
                  ? 'border-white/60 bg-white/55 shadow-[0_8px_32px_rgba(255,255,255,0.25)] scale-[1.02]' 
                  : 'border-white/30 shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
              }`}
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '400' }}
            />
          </div>

          {/* Start button */}
          <button
            type="submit"
            className="group relative w-full px-10 py-4 rounded-full bg-gradient-to-r from-[#FF6B9D] via-[#DA70D6] to-[#C471F5] text-white text-lg font-semibold tracking-wide shadow-[0_8px_30px_rgba(255,107,157,0.35)] hover:shadow-[0_12px_40px_rgba(255,107,157,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Scan
              <span className="text-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">✨</span>
            </span>
          </button>

        </form>

        {/* Bottom text - CENTERED */}
        <p 
          className="mt-8 text-sm text-white/70 text-center animate-fade-in animation-delay-400"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}
        >
          Your vibe attracts your tribe ✨
        </p>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-40px, 40px) scale(0.95);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 30s ease-in-out infinite;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .animation-delay-8000 {
          animation-delay: 8s;
        }
      `}</style>
    </div>
  );
}