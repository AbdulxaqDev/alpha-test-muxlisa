import iphone from "./images/hero_iphone_small.png";
import airpods from "./images/hero_airpods_large.png";
import tv from "./images/hero_apple_tv_small.png";
import homepod from "./images/hero_homepod_mini_small.png";
import awatch from "./images/hero_watch_large.png";
import ipad from "./images/hero_ipad_small.png";
import React from "react";
import "./styles/FirstLook.css";

const Images = () => {
  return (
    <div className="images w-full h-screen ">
      <img
        src={iphone}
        alt="iphone"
        className="iphone absolute left-[38.5%] top-[-1%] w-[21.5%] animate__animated animate__fadeInDown animate__delay-1s"
      />
      <img
        src={homepod}
        alt="iphone"
        className="absolute right-[35.3%]  top-[69%]
        w-[28.5%] animate__animated animate__fadeInUp animate__delay-1s"
      />
      <img
        src={awatch}
        alt="iphone"
        className="absolute right-[13%] top-[2%]  w-[17%]
        animate__animated animate__fadeInTopRight animate__delay-1s"
      />
      <img
        src={tv}
        alt="iphone"
        className="absolute w-[33%] right-[-2.7%;] top-[47%] animate__animated animate__fadeInBottomRight animate__delay-1s"
      />
      <img
        src={ipad}
        alt="iphone"
        className="absolute w-[70.2%] left-[-41.5%]
        top-[-0.4%] animate__animated animate__fadeInLeft animate__delay-1s"
      />
      <img
        src={airpods}
        alt="iphone"
        className="absolute w-[12.4%] left-[18%] top-[5%] animate__animated animate__fadeInTopLeft animate__delay-1s"
      />
    </div>
  );
};

export default Images;
