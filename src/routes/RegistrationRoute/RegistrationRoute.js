import React from "react";
import "./RegistrationRoute.css";

const RegistrationRoute = ({ className, children, ...props }) => {
  return (
    <div
      className={`registration-route${className ? " " + className : ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default RegistrationRoute;
