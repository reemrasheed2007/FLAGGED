import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import html2canvas from "html2canvas";

export default function Result({ onRestart }) {
  const location = useLocation();
  const name = location.state?.name || "User"; 
  const score = location.state?.score || 0;

  const [result, setResult] = useState({});
  const [animate, setAnimate] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isCapturing, setIsCapturing] = useState(false);
  
  const resultCardRef = useRef(null);

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const quotes = {
      red: [
        `${name}, you're not toxic… just a walking red flag 🚩`,
        "Therapy is calling 📞 pick up pls",
        "Self-awareness left the chat 💀",
        `${name}, you didn't fail… the test exposed you`,
      ],
      mid: [
        `${name}, not toxic… just creatively problematic 😌`,
        "50% green, 50% chaos 😭",
        "Potential detected… proceed with caution ⚠️",
      ],
      green: [
        `${name}, green flag energy 🌱`,
        "You pass the vibe check ✔️lessgo mommy",
        "Certified safe human 🫶",
      ],
    };

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    let res = {};

    if (score >= 70) {
      res = {
        label: "RED FLAG",
        emoji: "🚩",
        quote: getRandom(quotes.red),
        bg: "bg-gradient-to-br from-[#1a0505] via-[#2d0a0a] to-[#1a0505]",
        cardBg: "bg-gradient-to-b from-[#4a1515]/40 to-[#2d0a0a]/60",
        barColor: "#ff0000",
        barColorEnd: "#ff6b6b",
        glow: "shadow-[0_0_60px_rgba(255,0,0,0.4)]",
        textGlow: "drop-shadow-[0_0_12px_rgba(255,68,68,0.8)]",
        shake: "animate-[shake_0.4s_ease-in-out_2]",
        borderColor: "border-red-500/30",
      };
    } else if (score >= 40) {
      res = {
        label: "MID ZONE",
        emoji: "⚠️",
        quote: getRandom(quotes.mid),
        bg: "bg-gradient-to-br from-[#1a1005] via-[#2d1a0a] to-[#1a1005]",
        cardBg: "bg-gradient-to-b from-[#4a3515]/40 to-[#2d1a0a]/60",
        barColor: "#ff6b00",
        barColorEnd: "#ffcc00",
        glow: "shadow-[0_0_60px_rgba(255,165,0,0.3)]",
        textGlow: "drop-shadow-[0_0_12px_rgba(255,165,0,0.8)]",
        borderColor: "border-orange-500/30",
      };
    } else {
      res = {
        label: "GREEN FLAG",
        emoji: "💚",
        quote: getRandom(quotes.green),
        bg: "bg-gradient-to-br from-[#051a0f] via-[#0a2d1a] to-[#051a0f]",
        cardBg: "bg-gradient-to-b from-[#154a35]/40 to-[#0a2d1a]/60",
        barColor: "#00ff88",
        barColorEnd: "#00ffcc",
        glow: "shadow-[0_0_60px_rgba(62,255,227,0.4)]",
        textGlow: "drop-shadow-[0_0_12px_rgba(62,255,227,0.8)]",
        greenFlag: true,
        borderColor: "border-emerald-400/30",
      };
    }

    setResult(res);
    setTimeout(() => setAnimate(true), 200);
    setTimeout(() => setGlowPulse(true), 400);
  }, [score, name]);

  // Screenshot and share function
  const handleShare = async () => {
    if (!resultCardRef.current) return;

    try {
      setIsCapturing(true);

      // Wait a moment for any animations to settle
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the result card as canvas
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Failed to create image");
          setIsCapturing(false);
          return;
        }

        // Try native share API first (mobile)
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], 'my-flag-status.png', { type: 'image/png' });
            
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'My FLAG Status',
                text: `I got ${score}/100 on the FLAG scan! ${result.label}`,
              });
              setIsCapturing(false);
              return;
            }
          } catch (err) {
            console.log("Native share failed, falling back to download");
          }
        }

        // Fallback: Download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `flag-status-${name}-${score}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setIsCapturing(false);
        
        // Show success message
        alert("Image saved! Check your downloads 📸");
      }, 'image/png');

    } catch (error) {
      console.error("Screenshot failed:", error);
      alert("Failed to capture image. Please try again.");
      setIsCapturing(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${result.bg} relative overflow-hidden py-8`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ background: `linear-gradient(to bottom right, ${result.barColor || '#ff0000'}, transparent)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ background: `linear-gradient(to bottom right, ${result.barColorEnd || '#ff6b6b'}, transparent)`, animationDelay: '1s' }}
        ></div>
      </div>

      {/* Confetti for green flag */}
      {result.greenFlag && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[scan_4s_linear_infinite]"></div>
      </div>

      {/* Result Card - This will be captured */}
      <div 
        ref={resultCardRef}
        className={`relative z-10 p-6 md:p-8 rounded-3xl w-[90%] max-w-[420px] ${result.cardBg} backdrop-blur-2xl border-2 ${result.borderColor} ${result.shake} ${result.glow} transition-all duration-700 ${animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        
        {/* Header with custom font */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-black italic text-white mb-2 tracking-wider" style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif", letterSpacing: '0.1em' }}>
            FLAG STATUS
          </h1>
          <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </div>

        {/* Name badge */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <p className="text-xs font-semibold text-white/90">{name} <span className="opacity-60">👀</span></p>
          </div>
        </div>

        {/* Main score display with emoji */}
        <div className={`text-center mb-5 transition-all duration-1000 ${glowPulse ? 'scale-100' : 'scale-90'}`}>
          <div className="relative inline-block">
            {/* Pulsing glow effect */}
            <div 
              className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
              style={{ background: `linear-gradient(to right, ${result.barColor || '#ff0000'}, ${result.barColorEnd || '#ff6b6b'})` }}
            ></div>
            
            <div className="relative">
              <div className="text-6xl md:text-7xl mb-3 animate-bounce-slow">
                {result.emoji}
              </div>
              <h2 className={`text-3xl md:text-4xl font-black italic ${result.textGlow} text-white mb-2`} 
                  style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif", letterSpacing: '0.15em' }}>
                {result.label}
              </h2>
            </div>
          </div>
        </div>

        {/* Score number with circular progress */}
        <div className="relative w-36 h-36 mx-auto mb-5">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="65"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
              fill="none"
            />
            {/* Animated progress circle */}
            <circle
              cx="72"
              cy="72"
              r="65"
              stroke={result.barColor || '#ff0000'}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 65}`}
              strokeDashoffset={animate ? `${2 * Math.PI * 65 * (1 - score / 100)}` : `${2 * Math.PI * 65}`}
              className="transition-all duration-2000 ease-out"
              style={{ filter: `drop-shadow(0 0 8px ${result.barColor})` }}
            />
          </svg>
          
          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-black ${result.textGlow} text-white`} style={{ fontFamily: "'Bebas Neue', monospace" }}>
              {score}
            </div>
            <div className="text-lg text-white/60 font-bold">/ 100</div>
          </div>
        </div>

        {/* Gradient progress bar */}
        <div className="mb-5">
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 shadow-inner">
            <div
              className="h-full transition-all duration-[1500ms] ease-out"
              style={{ 
                width: animate ? `${score}%` : "0%",
                background: `linear-gradient(to right, ${result.barColor}, ${result.barColorEnd})`,
                boxShadow: `0 0 15px ${result.barColor}`
              }}
            />
          </div>
        </div>

        {/* Quote with better styling */}
        <div className="mb-6 px-2">
          <div className="relative">
            <div className="absolute -left-1 -top-1 text-4xl text-white/10 font-serif">"</div>
            <p className="relative text-base md:text-lg text-center italic text-white/90 leading-snug font-medium px-4" 
               style={{ fontFamily: "'Georgia', serif" }}>
              {result.quote}
            </p>
            <div className="absolute -right-1 -bottom-4 text-4xl text-white/10 font-serif">"</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={isCapturing}
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-base hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
          >
            {isCapturing ? (
              <>
                <span className="animate-spin">⏳</span>
                CAPTURING...
              </>
            ) : (
              <>
                <span>📸</span>
                SHARE THIS
              </>
            )}
          </button>

          {/* Retake Button */}
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-base hover:scale-105 hover:bg-white/20 transition-all duration-300 active:scale-95"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
          >
            SCAN AGAIN
          </button>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/20"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/20"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/20"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/20"></div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px) rotate(-2deg); }
          75% { transform: translateX(10px) rotate(2deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .duration-2000 {
          transition-duration: 2000ms;
        }
      `}</style>
    </div>
  );
}