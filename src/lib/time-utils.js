export const formatSeconds = (seconds) => {
  let secondsLeft = parseInt(seconds);
  const hours = parseInt(seconds / 3600);
  secondsLeft = secondsLeft % 3600;
  const minutes = parseInt(secondsLeft / 60);
  secondsLeft = secondsLeft % 60;

  const hourString = formatTimePart(hours, 'hour', ' ');
  const minuteString = formatTimePart(minutes, 'minute', ' ');
  const secondString = formatTimePart(secondsLeft, 'second', ' ');

  return hourString + minuteString + secondString;
};

export const formatTimePart = (part, unit, pad = '') => {
  if (!part) {
    return '';
  }

  if (part > 1) {
    return `${pad}${part} ${unit}s${pad}`;
  }

  return `${pad}${part} ${unit}${pad}`;
};
