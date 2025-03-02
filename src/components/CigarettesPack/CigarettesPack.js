import React, { useMemo } from "react";

const CigarettesPack = ({ todaySmokings }) => {
  const todaySmokingsCount = useMemo(() => {
    return todaySmokings.length;
  }, [todaySmokings]);

  return (
    <div className="cigarette-box">
      <div className="d-flex">
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 1 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 2 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 3 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 4 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 5 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 6 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 7 ? "circle smoked" : "circle"}
          ></div>
        </div>
      </div>
      <div className="d-flex">
        <div className="hole"></div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 8 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 9 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 10 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 11 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 12 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 13 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="hole"></div>
      </div>
      <div className="d-flex">
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 14 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 15 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 16 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 17 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 18 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 19 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={todaySmokingsCount >= 20 ? "circle smoked" : "circle"}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CigarettesPack;
