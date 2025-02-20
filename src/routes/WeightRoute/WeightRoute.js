import React from "react";
import "./WeightRoute.css";

const WeightRoute = ({ data, children, ...props }) => {
  return (
    <div className="weight-route" {...props}>
      <div>Weight Route</div>
      <div className="response">{data}</div>
      {children}
    </div>
  );
};

export default WeightRoute;
