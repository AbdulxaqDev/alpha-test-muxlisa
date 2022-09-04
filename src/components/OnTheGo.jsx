import React, { useEffect } from "react";
import ChatExample from "../mixins/ChatExample";
import "../style/FirstLook.css"
import AOS from "aos";
import "aos/dist/aos.css";

export default function OnTheGo() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  return (
    <div className="onTheGo w-[700px] h-[720px] container relative mt-[200px] mb-[100px] mx-auto text-left overflow-hidden text-cyan-500">
      <h1
        data-aos="fade-up"
        className="text-[130px] pb-[70px] text-transparent bg-gradient-to-r from-[#35ffee] to-[#c509a7] bg-clip-text font-medium leading-[100px]"
      >
        Salom, {process.env.REACT_APP_ASSISTANT_NAME}
      </h1>
      <div className="info flex justify-between h-[550px] overflow-hidden">
        <p
          className="info-title h-[200px] w-[225px] text-[25px]"
          data-aos="fade-right"
        >
          Endi o'zbek tilini ham tushuna oladigan ovozli yordamchi
          <br />
          <br />
          Kundalik vazifalarni faqat ovozingiz bilan bajaring.
        </p>

        <ChatExample />
      </div>
    </div>
  );
};
