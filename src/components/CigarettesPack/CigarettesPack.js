import React, { useMemo } from "react";
import "./CigarettesPack.css";

const CigarettesPack = ({ todaySmokings, limitToday }) => {
  const todaySmokingsCount = useMemo(() => {
    return todaySmokings.length;
  }, [todaySmokings]);

  const forbidden = 32;
  return (
    <div className="cigarette-box mb-3">
      <div className="d-flex">
        <div
          className={`circle-background${limitToday < 1 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 1 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 2 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 2 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 3 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 3 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 4 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 4 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 5 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 5 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 6 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 6 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 7 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 7 ? "circle smoked" : "circle"}
          ></div>
        </div>
      </div>
      <div className="d-flex">
        <div className={`hole${limitToday < 8 ? " forbidden" : ""}`}></div>
        <div
          className={`circle-background${limitToday < 8 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 8 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 9 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 9 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 10 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 10 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 11 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 11 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 12 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 12 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 13 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 13 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div className={`hole${limitToday < 13 ? " forbidden" : ""}`}></div>
      </div>
      <div className="d-flex">
        <div
          className={`circle-background${limitToday < 14 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 14 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 15 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 15 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 16 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 16 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 17 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 17 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 18 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 18 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 19 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 19 ? "circle smoked" : "circle"}
          ></div>
        </div>
        <div
          className={`circle-background${limitToday < 20 ? " forbidden" : ""}`}
        >
          <div
            className={todaySmokingsCount >= 20 ? "circle smoked" : "circle"}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CigarettesPack;
