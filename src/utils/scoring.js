export function calculateResult(answers) {
  const total = answers.reduce((acc, val) => acc + val, 0);

  const maxScore = answers.length * 4;
  const minScore = answers.length * 1;

  const percentage =
    ((total - minScore) / (maxScore - minScore)) * 100;

  return Math.round(percentage); // ✅ ONLY RETURN SCORE
}

