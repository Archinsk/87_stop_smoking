export const getAverageFromNumbersArray = (array) => {
  return array.reduce((a, b) => a + b) / array.length;
};
