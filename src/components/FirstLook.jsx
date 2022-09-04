import React from "react";
import Background from "../mixins/Background";
import Button from "../mixins/Button";
import "../style/FirstLook.css";


const FirstLook = () => {
  return (
    <div className="animate relative z-30 h-screen w-[100%] flex items-center justify-center ">
      <div className="animate">
        <Background />
      </div>
      <Button/>
      <div className="firstlook_title absolute w-[600px] h-[300px] flex-col flex items-center justify-center text-center">
        <h1 className="relative pl-[25px] font-extrabold text-transparent bg-gradient-to-r from-[#35ffee] to-[#c509a7] bg-clip-text text-[9vw] animate__animated animate__zoomIn ">
          {process.env.REACT_APP_ASSISTANT_NAME} 
        </h1>
        <h5 className="relative pb-[30px] font-extrabold text-transparent text-[3vw] bg-clip-text bg-gradient-to-r from-[#35ffee] to-[#c509a7] z-59">
          ovozli yordamchi
        </h5>
      </div>
    </div>
  );
};

export default FirstLook;
