import React from "react";
import "./WeightRoute.css";

const WeightRoute = ({ className, children, ...props }) => {
  return (
    <div
      className={`weight-route${className ? " " + className : ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default WeightRoute;
