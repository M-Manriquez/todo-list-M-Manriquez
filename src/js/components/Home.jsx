import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import Todos from "./Todos";

//create your first component
const Home = () => {
  return (
    <div className="container">
      <div className="mx-auto my-5" style={{ maxWidth: "600px" }}>
        <Todos />
      </div>
    </div>
  );
};

export default Home;
