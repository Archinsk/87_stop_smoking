import React from "react";
import "./SmokingRoute.css";

const SmokingRoute = ({ data, children, ...props }) => {
  return (
    <div className="smoking-route" {...props}>
      <div>Smoking Route</div>
      <div className="response">{data}</div>
      {children}
    </div>
  );
};

export default SmokingRoute;
