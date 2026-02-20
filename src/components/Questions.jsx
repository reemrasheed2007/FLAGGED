import React from "react";

export default function Questions({ question, onAnswer, index }) {
  if (!question) return null;

  const backgrounds = [
    "bg-gradient-to-br from-pink-500 via-orange-400 to-purple-500",
    "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500",
    "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    "bg-gradient-to-br from-teal-600 via-purple-500 to-pink-500",
    "bg-gradient-to-br from-red-500 via-orange-400 to-pink-500",
  ];

  const currentBg = backgrounds[index % backgrounds.length];

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-6 text-white ${currentBg}`}
    >
      <div className="w-full max-w-xl text-center">

        <h2 className="text-4xl sm:text-5xl mb-12 leading-tight font-display">
          {question.text}
        </h2>

        <div className="flex flex-col gap-6">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(opt.value)}
              className="
                px-8 py-4
                rounded-full
                text-lg font-semibold
                transition-all duration-300
                bg-[#FF4F81]
                hover:bg-[#3EFFE3]
                hover:text-black
                hover:scale-105
                shadow-[0_0_20px_#FF4F81]
                hover:shadow-[0_0_25px_#3EFFE3]
              "
            >
              {opt.text}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
