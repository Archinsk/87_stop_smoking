import React from "react";
import "./Alert.css";

const Alert = ({ className, children, ...props }) => {
  return (
    <div className={`alert${className ? " " + className : ""}`} {...props}>
      {children}
    </div>
  );
};

export default Alert;
