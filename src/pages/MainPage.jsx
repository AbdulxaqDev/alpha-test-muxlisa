import React from "react";
import "animate.css";
import FirstLook from "../components/FirstLook";
import OnTheGo from "../components/OnTheGo";
import Footer from "../components/Footer";
function MainPage() {
  //
  return (
    <div className="overflow-hidden w-full relative  bg-gradient-to-r from-[#3b5a8b] to-[#0f172a] ">
      <FirstLook />
      <OnTheGo />
       <Footer />
    </div>
  );
}

export default MainPage;