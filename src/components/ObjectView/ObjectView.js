import React from "react";
import "./ObjectView.css";
import PrimitivePropertyView from "../PrimitivePropertyView/PrimitivePropertyView";

const ObjectView = ({ objectData }) => {
  const properties = Object.entries(objectData).map((item, index) => {
    if (typeof item[1] === "object" && item[1] !== null) {
      return (
        <details key={index}>
          <summary>{item[0]}: </summary>
          <ObjectView objectData={item[1]} />
        </details>
      );
    } else {
      return (
        <PrimitivePropertyView
          key={index}
          propertyKey={item[0]}
          propertyValue={item[1]}
        />
      );
    }
  });

  return <div className="object">{properties}</div>;
};

export default ObjectView;
