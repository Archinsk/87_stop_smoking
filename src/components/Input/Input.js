import React from "react";
import "./Input.css";
import Label from "../Label/Label";

const Input = ({ label, comment, className, ...props }) => {
  return (
    <div className={`form-field-group${className ? " " + className : ""}`}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <input id={props.id} className="form-control" {...props} />
      {comment?.text && (
        <div id="emailHelp" className="form-text">
          Help text
        </div>
      )}
    </div>
  );
};

export default Input;
