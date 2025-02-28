import React from "react";
import "./Input.css";

const Input = ({ label, comment, className, ...props }) => {
  return (
    <div className="form-group">
      <label htmlFor={props.id} className="form-label">
        {label}
      </label>
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
