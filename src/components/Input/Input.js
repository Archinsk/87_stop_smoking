import React from "react";
import "./Input.css";
import Label from "../Label/Label";

const Input = ({ label, comment, className, ...props }) => {
  return (
    <div className="form-field-group">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <input
        id={props.id}
        className={`form-control${className ? " " + className : ""}`}
        {...props}
      />
      {comment?.text && (
        <div id="emailHelp" className="form-text">
          Help text
        </div>
      )}
    </div>
  );
};

export default Input;
