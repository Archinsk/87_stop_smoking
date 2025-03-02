export const convertTimestampToTimestampFromDayStart = (timestamp) => {
  return timestamp % 86400000;
};

export const convertMsFromDayStartToHMS = (ts) => {
  const formatter = new Intl.DateTimeFormat("ru", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return formatter.format(new Date(ts));
};

export const convertTimestampToHMS = (timestamp) => {
  const formatter = new Intl.DateTimeFormat("ru", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return formatter.format(new Date(timestamp));
};

export const convertTimestampToDMY = (timestamp) => {
  const formatter = new Intl.DateTimeFormat("ru", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatter.format(new Date(timestamp));
};

export const convertTimestampToW = (timestamp) => {
  const formatter = new Intl.DateTimeFormat("ru", {
    weekday: "short",
  });
  return formatter.format(new Date(timestamp));
};
