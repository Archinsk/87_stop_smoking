import React from "react";
import "./ObjectView.css";
import PrimitivePropertyView from "../PrimitivePropertyView/PrimitivePropertyView";

const ObjectView = ({ objectData }) => {
  let properties;
  if (Object.entries(objectData)) {
    properties = Object.entries(objectData).map((item) => {
      return (
        <PrimitivePropertyView propertyKey={item[0]} propertyValue={item[1]} />
      );
    });
  }
  return <div className="object">{properties}</div>;
};

export default ObjectView;
