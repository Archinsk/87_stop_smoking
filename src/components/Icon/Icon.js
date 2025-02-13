import React from "react";
import "./Icon.css";

const Icon = ({ className, name = "star", ...props }) => {
  return (
    <span className={`icon${className ? " " + className : ""}`} {...props}>
      {name}
    </span>
  );
};

export default Icon;
