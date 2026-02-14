export const calculateReliabilityScore = (stats) => {
  let score = 100;

  score += stats.completedJobs * 10;
  score -= stats.cancelledJobs * 15;

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return score;
};
