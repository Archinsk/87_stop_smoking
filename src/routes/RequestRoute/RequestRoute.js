import React from "react";
import "./RequestRoute.css";
import ObjectView from "../../components/ObjectView/ObjectView";
import Button from "../../components/Button/Button";

const RequestRoute = ({
  responses,
  onGetRequest,
  onPostRequest,
  onCheckAuth,
  onGetUser,
  onLogout,
  onClearResponses,
  className,
}) => {
  return (
    <div className={`request-route${className ? " " + className : ""}`}>
      <div className="mb-3">
        <Button onClick={onGetRequest}>GET</Button>
        <Button onClick={onPostRequest}>POST</Button>
        <Button onClick={onClearResponses}>ClearResponses</Button>
        <Button onClick={onCheckAuth}>CheckAuth</Button>
        <Button onClick={onGetUser}>GetUser</Button>
        <Button onClick={onLogout}>LogOut</Button>
        {/* <Button onClick={handleGetGeoPosition}>GetGeo</Button> */}
      </div>
      {responses && <ObjectView objectData={{ responses }} />}
      {!responses && <div>No Response Data</div>}
    </div>
  );
};

export default RequestRoute;
