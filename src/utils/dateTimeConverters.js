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

export const convertTimestampToDMYHMS = (timestamp) => {
  const formatter = new Intl.DateTimeFormat("ru", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return formatter.format(new Date(timestamp));
};

export const convertTimestampToW = (timestamp) => {
  const formatter = new Intl.DateTimeFormat("ru", {
    weekday: "short",
  });
  return formatter.format(new Date(timestamp));
};

export const convertTimestampToDatetimeLocal = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${year}-${String(month).padStart(2, `0`)}-${String(day).padStart(2, `0`)}T${String(hour).padStart(2, `0`)}:${String(minute).padStart(2, `0`)}`;
};
