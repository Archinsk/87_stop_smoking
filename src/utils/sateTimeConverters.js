export const convertTimestampToTimestampFromDayStart = (timestamp) => {
  return timestamp % 86400000;
};

export const convertMsFromDayStartToHMS = (ts) => {
  let formatter = new Intl.DateTimeFormat("ru", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return formatter.format(new Date(ts));
};
