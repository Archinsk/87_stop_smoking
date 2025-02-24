import React from "react";
import "./RequestRoute.css";
import PrimitivePropertyView from "../../components/PrimitivePropertyView/PrimitivePropertyView";
import ObjectView from "../../components/ObjectView/ObjectView";

const RequestRoute = ({ responseData, className, children, ...props }) => {
  return (
    <div
      className={`request-route${className ? " " + className : ""}`}
      {...props}
    >
      {children}
      {responseData && (
        <ObjectView objectData={{ responseBody: responseData }} />
      )}
      {!responseData && <div>No Response Data</div>}
    </div>
  );
};

export default RequestRoute;
