import React from "react";
import ShapeCreator from "./components/ShapeCreator";
import "./css/main.css";

const Main = () => {
  return (
    <>
      <div class="side-div">
        <div class="paint-tools-div">
          <ShapeCreator />
        </div>
      </div>
    </>
  );
};

export default Main;
