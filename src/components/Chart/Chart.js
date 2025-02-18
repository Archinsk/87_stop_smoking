import React, { useEffect } from "react";

const Chart = ({ id, config }) => {
  useEffect(() => {
    if (id && config) {
      new Chart(document.getElementById(id), config);
    }
  }, [id, config]);

  return;
};

export default Chart;
