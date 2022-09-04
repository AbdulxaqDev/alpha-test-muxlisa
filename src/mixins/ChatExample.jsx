import wow from "../assets/images/wowGirl.gif";
import "../style/chatExample.css";

function ChatExample() {
  console.log("test", process.env.REACT_APP_ASSISTANT_NAME);
  const Data = new Date();
  const nowHours = Data.getHours();
  const nowMinutes = Data.getMinutes();
  return (
    <div className="chatExample relative  w-[400px] h-[350px] ">
      <p className="h-[150px] w-[350px] mr-0 bg-purple-300 red text-[2vw] ">
        <h5 className="relative text-right top-[38px] right-[28px] text-[28px] animate__animated animate__fadeIn animate__delay-2s">
          {" "}
          {process.env.REACT_APP_ASSISTANT_NAME} soat nechi bo'ldi?
        </h5>
      </p>
      <p className="h-[150px] w-[350px] mt-[20px] bg-blue-300 green text-[2vw] ">
        <h5 className="relative text-right top-[50px] left-[-50px] text-[28px] animate__animated animate__fadeIn animate__delay-3s">
          Hozir vaqt {nowHours}:
          {nowMinutes < 10 ? "0" + nowMinutes : nowMinutes}
        </h5>
      </p>
      <img
        src={wow}
        alt="wow"
        className="absolute top-[150px]  left-[-220px]"
      />
    </div>
  );
}

export default ChatExample;
