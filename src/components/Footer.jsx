import React from "react";
import logo from '../assets/images/uz.png'

function Footer() {
  return (
    <div className="footer border-t-2 relative w-[1300px] mx-auto h-[70px] flex items-center justify-center text-transparent lg:space-x-[300px] sm:space-x-[30px] bg-gradient-to-r from-[#35ffee] to-[#c509a7] bg-clip-text">
    <h3 className=" text-[20px]">Muxlisa</h3>
    <div className="social lg:space-x-[40px] sm:space-x-[0px]">
    <a href="https://www.facebook.com/uzinfocom.uz/" className="facebook text-[#4267B2]">
        Facebook
      </a>
      <a
        href="https://www.instagram.com/uzinfocom_official/"
        className="instagram text-transparent bg-gradient-to-r from-[#c500e8] via-[#fb07be] to-[#fb9507] bg-clip-text"
      >
        Instagram
      </a>
      <a href="https://t.me/uzinfocomofficial" className="telegram text-[#0088cc]">
        Telegram
      </a>
    </div>
      <p className="companyLogo text-blue-600">
        <a href="https://uzinfocom.uz/" className="flex">
          <img src={logo} alt="logo" className="" />
        </a>
      </p>
    </div>
  );
}

export default Footer;
