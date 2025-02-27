import React from "react";

const CigarettesPack = ({ todaySmokingsCount }) => {
  return (
    <div className="cigarette-box">
      <div className="d-flex">
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 1 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 2 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 3 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 4 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 5 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 6 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 7 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
      </div>
      <div className="d-flex">
        <div className="hole"></div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 8 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 9 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 10 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 11 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 12 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 13 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="hole"></div>
      </div>
      <div className="d-flex">
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 14 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 15 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 16 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 17 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 18 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 19 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
        <div className="circle-background">
          <div
            className={
              todaySmokingsCount.length >= 20 ? "circle smoked" : "circle"
            }
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CigarettesPack;
