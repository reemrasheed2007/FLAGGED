import { useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";

export default function Scanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [scanProgress, setScanProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showDoodles, setShowDoodles] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  const scanMessages = [
    "Reading your energy... ✨",
    "Sensing your vibe... 💫",
    "Checking your aura... 🌸",
    "Analyzing your essence... 💕",
    "Measuring your wavelength... 🦋",
    "Almost there... 🌟"
  ];

  useEffect(() => {
    let stream;
    let faceDetection;
    let animationId;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = async () => {
            videoRef.current.play();
            await loadFaceDetection();
          };
        }
      } catch (error) {
        console.log("Camera access denied");
      }
    }

    async function loadFaceDetection() {
      try {
        const { FaceDetection } = await import('@mediapipe/face_detection');
        const { Camera } = await import('@mediapipe/camera_utils');

        faceDetection = new FaceDetection({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
          }
        });

        faceDetection.setOptions({
          model: 'short',
          minDetectionConfidence: 0.5
        });

        faceDetection.onResults(onFaceDetectionResults);

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await faceDetection.send({ image: videoRef.current });
          },
          width: 640,
          height: 480
        });

        camera.start();
      } catch (error) {
        console.log("Face detection not available");
      }
    }

    function onFaceDetectionResults(results) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.detections && results.detections.length > 0) {
        setFaceDetected(true);
        
        results.detections.forEach((detection) => {
          const box = detection.boundingBox;
          
          const x = box.xCenter * canvas.width - (box.width * canvas.width) / 2;
          const y = box.yCenter * canvas.height - (box.height * canvas.height) / 2;
          const width = box.width * canvas.width;
          const height = box.height * canvas.height;

          // Draw modern rounded rectangle box
          ctx.strokeStyle = '#FF6B9D';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 4]);
          
          const radius = 20;
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.stroke();

          // Draw corner L-brackets - THICKER for mobile visibility
          ctx.setLineDash([]);
          ctx.strokeStyle = '#FF2E63';
          ctx.lineWidth = 5; // Increased from 4
          ctx.lineCap = 'round';

          const cornerSize = 35; // Increased from 30
          
          // Top left
          ctx.beginPath();
          ctx.moveTo(x + cornerSize, y);
          ctx.lineTo(x, y);
          ctx.lineTo(x, y + cornerSize);
          ctx.stroke();

          // Top right
          ctx.beginPath();
          ctx.moveTo(x + width - cornerSize, y);
          ctx.lineTo(x + width, y);
          ctx.lineTo(x + width, y + cornerSize);
          ctx.stroke();

          // Bottom left
          ctx.beginPath();
          ctx.moveTo(x, y + height - cornerSize);
          ctx.lineTo(x, y + height);
          ctx.lineTo(x + cornerSize, y + height);
          ctx.stroke();

          // Bottom right
          ctx.beginPath();
          ctx.moveTo(x + width, y + height - cornerSize);
          ctx.lineTo(x + width, y + height);
          ctx.lineTo(x + width - cornerSize, y + height);
          ctx.stroke();

          // Draw center crosshair
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          
          ctx.strokeStyle = '#FF6B9D';
          ctx.lineWidth = 3; // Increased from 2
          ctx.setLineDash([]);

          // Horizontal line
          ctx.beginPath();
          ctx.moveTo(centerX - 12, centerY);
          ctx.lineTo(centerX + 12, centerY);
          ctx.stroke();

          // Vertical line
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 12);
          ctx.lineTo(centerX, centerY + 12);
          ctx.stroke();

          // Center dot
          ctx.fillStyle = '#FF6B9D';
          ctx.beginPath();
          ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      } else {
        setFaceDetected(false);
      }
    }

    startCamera();

    setTimeout(() => setShowDoodles(true), 300);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1.4;
      });
    }, 100);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % scanMessages.length);
    }, 1200);

    const timer = setTimeout(() => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      navigate("/question/0", {
        state: { name: location.state?.name },
      });
    }, 7000);

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [navigate, location]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Camera feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-95"
      />

      {/* Canvas for face detection */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Soft pastel overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-purple-100/20 to-blue-100/20 backdrop-blur-[1px]"></div>

      {/* Floating doodles */}
      {showDoodles && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="star star-1">⭐</div>
          <div className="star star-2">✨</div>
          <div className="star star-3">💫</div>
          <div className="star star-4">⭐</div>
          
          <div className="heart heart-1">💕</div>
          <div className="heart heart-2">💗</div>
          <div className="heart heart-3">💖</div>
          
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">🌟</div>
          <div className="sparkle sparkle-3">💫</div>
          
          <div className="flower flower-1">🌸</div>
          <div className="flower flower-2">🌺</div>
          <div className="flower flower-3">🌼</div>
          
          <div className="butterfly butterfly-1">🦋</div>
          <div className="butterfly butterfly-2">🦋</div>
        </div>
      )}

      {/* Soft scanning wave */}
      <div className="scan-wave"></div>

      {/* Top status */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-20">
        <div className="text-center">
          <div className="inline-block px-5 py-2.5 bg-white/70 backdrop-blur-xl rounded-full shadow-lg border-2 border-pink-200/50">
            <p className="text-pink-600 font-medium text-xs md:text-sm flex items-center gap-2 justify-center">
              <span className={`w-2 h-2 ${faceDetected ? 'bg-green-500' : 'bg-pink-500'} rounded-full animate-pulse`}></span>
              {faceDetected ? 'Face detected!' : 'Scanning your vibes...'}
            </p>
          </div>
        </div>
      </div>

      {/* Center message - NO OVAL, JUST TEXT */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20 px-4">
        <p 
          className="text-pink-600 font-bold text-lg md:text-2xl"
          style={{ 
            textShadow: '0 2px 12px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)',
            WebkitTextStroke: '0.5px rgba(255,255,255,0.5)'
          }}
        >
          {scanMessages[currentMessage]}
        </p>
      </div>

      {/* Bottom HUD - FIXED FOR MOBILE */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 pb-safe">
        <div className="max-w-md mx-auto">
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-pink-600 font-medium text-xs md:text-sm">✨ Progress</span>
              <span className="text-pink-600 font-bold text-xs md:text-sm">{Math.floor(scanProgress)}%</span>
            </div>
            
            <div className="relative h-2.5 md:h-3 bg-white/70 backdrop-blur-xl rounded-full overflow-hidden border-2 border-pink-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all duration-300 ease-out relative rounded-full"
                style={{ width: `${scanProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-soft"></div>
              </div>
              
              <div 
                className="absolute top-1/2 -translate-y-1/2 text-base md:text-xl transition-all duration-300"
                style={{ left: `${Math.min(scanProgress, 95)}%` }}
              >
                🌟
              </div>
            </div>
          </div>

          {/* Info cards - SMALLER FOR MOBILE */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl p-2 md:p-3 text-center border-2 border-pink-200/50 shadow-lg">
              <p className="text-pink-500 text-[10px] md:text-xs mb-0.5 md:mb-1">✨ Vibes</p>
              <p className="text-pink-600 font-bold text-xs md:text-sm">
                {Math.floor(scanProgress / 10)}/10
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl p-2 md:p-3 text-center border-2 border-purple-200/50 shadow-lg">
              <p className="text-purple-500 text-[10px] md:text-xs mb-0.5 md:mb-1">💕 Energy</p>
              <p className="text-purple-600 font-bold text-xs md:text-sm">
                {Math.floor(scanProgress)}%
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl p-2 md:p-3 text-center border-2 border-blue-200/50 shadow-lg">
              <p className="text-blue-500 text-[10px] md:text-xs mb-0.5 md:mb-1">🌸 Aura</p>
              <p className="text-blue-600 font-bold text-xs md:text-sm">
                {faceDetected ? '★★★★★' : '★★★★☆'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scan-wave {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 107, 157, 0.6),
            rgba(199, 125, 255, 0.6),
            transparent
          );
          box-shadow: 0 0 20px rgba(255, 107, 157, 0.4);
          animation: scanSoft 3s ease-in-out infinite;
          border-radius: 10px;
          z-index: 5;
        }

        @keyframes scanSoft {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(50vh); opacity: 0.8; }
        }

        .star, .heart, .sparkle, .flower, .butterfly {
          position: absolute;
          font-size: 20px;
          animation: floatDoodle 4s ease-in-out infinite;
        }

        @media (min-width: 768px) {
          .star, .heart, .sparkle, .flower, .butterfly {
            font-size: 24px;
          }
        }

        .star-1 { top: 15%; left: 10%; animation-delay: 0s; }
        .star-2 { top: 20%; right: 15%; animation-delay: 0.5s; }
        .star-3 { bottom: 25%; left: 15%; animation-delay: 1s; }
        .star-4 { bottom: 20%; right: 10%; animation-delay: 1.5s; }

        .heart-1 { top: 35%; left: 5%; animation-delay: 0.3s; }
        .heart-2 { top: 45%; right: 8%; animation-delay: 0.8s; }
        .heart-3 { bottom: 35%; left: 12%; animation-delay: 1.3s; }

        .sparkle-1 { top: 25%; left: 20%; animation-delay: 0.2s; }
        .sparkle-2 { top: 60%; right: 12%; animation-delay: 0.7s; }
        .sparkle-3 { bottom: 30%; right: 20%; animation-delay: 1.2s; }

        .flower-1 { top: 40%; left: 8%; animation-delay: 0.4s; }
        .flower-2 { top: 55%; right: 10%; animation-delay: 0.9s; }
        .flower-3 { bottom: 40%; right: 15%; animation-delay: 1.4s; }

        .butterfly-1 { top: 30%; right: 5%; animation-delay: 0.6s; }
        .butterfly-2 { bottom: 45%; left: 10%; animation-delay: 1.1s; }

        @keyframes floatDoodle {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.6;
          }
          25% {
            transform: translateY(-15px) rotate(5deg);
            opacity: 0.9;
          }
          50% { 
            transform: translateY(-10px) rotate(-5deg); 
            opacity: 0.7;
          }
          75% {
            transform: translateY(-20px) rotate(3deg);
            opacity: 0.8;
          }
        }

        @keyframes shimmer-soft {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .animate-shimmer-soft {
          animation: shimmer-soft 3s infinite;
        }

        /* Safe area for mobile notches */
        .pb-safe {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
}