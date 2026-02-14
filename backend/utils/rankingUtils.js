export const calculateJobScore = (job, expectedRate) => {
  let score = 0;

  // ✅ Budget Weight
  score += job.budget * 2;

  // ✅ Freshness Weight
  const hoursOld = (Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60);

  score -= hoursOld * 10;

  // ✅ Compatibility Boost
  if (expectedRate) {
    if (job.budget >= expectedRate) score += 100;
    else if (job.budget >= expectedRate * 0.7) score += 40;
  }

  return score;
};
