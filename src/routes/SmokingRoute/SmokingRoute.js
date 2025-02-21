import React from "react";
import "./SmokingRoute.css";

const SmokingRoute = ({ className, children, ...props }) => {
  return (
    <div
      className={`smoking-route${className ? " " + className : ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default SmokingRoute;
