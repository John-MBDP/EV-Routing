export const parseSeconds = (secs) => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  return { hours, minutes };
};

export const getDurationString = (duration) => {
  const {
    hours: durationHours,
    minutes: durationMinutes,
  } = parseSeconds(duration);

  return durationHours === 0
    ? `${durationMinutes} min`
    : `${durationHours} hr ${durationMinutes} min`;
};
