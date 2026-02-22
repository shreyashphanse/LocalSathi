export const stations = ["vasai", "nalasopara", "virar"];

export const getStationIndex = (station) => {
  if (!station) return -1;

  return stations.indexOf(station.toLowerCase().trim());
};

export const isStationOverlap = (jobFrom, jobTo, labourFrom, labourTo) => {
  const jobStartRaw = getStationIndex(jobFrom);
  const jobEndRaw = getStationIndex(jobTo);

  const labourStartRaw = getStationIndex(labourFrom);
  const labourEndRaw = getStationIndex(labourTo);

  if (
    jobStartRaw === -1 ||
    jobEndRaw === -1 ||
    labourStartRaw === -1 ||
    labourEndRaw === -1
  )
    return false;

  const jobStart = Math.min(jobStartRaw, jobEndRaw);
  const jobEnd = Math.max(jobStartRaw, jobEndRaw);

  const labourStart = Math.min(labourStartRaw, labourEndRaw);
  const labourEnd = Math.max(labourStartRaw, labourEndRaw);

  /* ✅ STRICT CONTAINMENT */

  return jobStart >= labourStart && jobEnd <= labourEnd;
};

export const getOverlapStrength = (jobFrom, jobTo, labourFrom, labourTo) => {
  const jobStart = getStationIndex(jobFrom);
  const jobEnd = getStationIndex(jobTo);

  const labourStart = getStationIndex(labourFrom);
  const labourEnd = getStationIndex(labourTo);

  if (
    jobStart === -1 ||
    jobEnd === -1 ||
    labourStart === -1 ||
    labourEnd === -1
  )
    return 0;

  const overlapStart = Math.max(jobStart, labourStart);
  const overlapEnd = Math.min(jobEnd, labourEnd);

  if (overlapStart > overlapEnd) return 0;

  const overlapSize = overlapEnd - overlapStart + 1;
  const jobRange = jobEnd - jobStart + 1;

  return overlapSize / jobRange;
};
