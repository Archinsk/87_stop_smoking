import React from "react";
import "./RegistrationRoute.css";

const RegistrationRoute = ({ data, children, ...props }) => {
  return (
    <div className="registration-route" {...props}>
      <div>Registration Route</div>
      <div className="response">{data}</div>
      {children}
    </div>
  );
};

export default RegistrationRoute;
