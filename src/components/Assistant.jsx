import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import axios from "axios";
import ringtone from "../assets/audio/ringtone.mp3";
import useRecorder from "../utils/use-recorder-utils";
import girl from "../assets/images/girl.jpg";
import "../style/Assistant.css";

export default function Assistant() {
  // const {
  //   // startRecording,
  //   // stopRecording,
  //   recorderState,
  //   audioData,
  //   setAudioData,
  // } = useRecorder();
  // const { audioUrl, audio, text } = recorderState;
  const [status, setStatus] = useState(
    "'Yozish' tugmasini bosib, ushlab turing."
  );
  const [audioLink, setAudioLink] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioText, setAudioText] = useState(null);
  const [data, setData] = useState(false);
  const scrollT = document.getElementById("assistant-textarea");
  // New instance of Audio and making ready to play ringtone
  const playAudio = new Audio(ringtone);

  // useEffect(() => {
  //   if (audioData) {
  //     setData(audioData);
  //   }
  // }, [audioData]);

  // useEffect(() => {
  //   if (audioUrl) {
  //     setAudioLink(audioUrl);
  //   }
  // }, [recorderState.audioUrl, audioUrl]);

  // useEffect(() => {
  //   if (audio) {
  //     setAudioFile(audio);
  //   }
  // }, [recorderState.audio, audio]);

  // useEffect(() => {
  //   if (text) {
  //     setAudioText(text);
  //   }
  // }, [recorderState.text, text]);

  const [localFile, setLocalFile] = useState(false);

  const [localAudioFile, setLocalAudioFile] = useState(null);

  // makes valid dovnload button or wiseversa
  const [validLink, setValidLink] = useState(false);

  // Swithces loader visibility
  const [loading, setLoading] = useState(false);

  // recording contols the Assistant Circle Svg animation
  const [recording, setRecording] = useState(false);

  // Array to store Oyimkiz's messages
  const [assistantMessage, setAssistantMessage] = useState([
    `Salom, Mening ismim ${process.env.REACT_APP_ASSISTANT_NAME}. "Yozish" tugmasini bosib gapirsangiz ovozingizni matn tarzida qaytaraman.`,
  ]);

  // Post local fayl
  const handleSave = async () => {
    // creating new instance of FormData
    const formData = new FormData();
    // Fetching local audio file with URL.createObjectURL
    const localAudioBlob = await fetch(
      URL.createObjectURL(localAudioFile)
    ).then((r) => r.blob());
    // Generating voice.wav file
    const localAdioFileBlobFile = new File([localAudioBlob], "voice.wav", {
      type: "audio/wav",
    });
    // Saving it to FormData
    formData.append("file", localAdioFileBlobFile);
    // Posting voice.wav file and adding text response to messages
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/v1/recognize/`,
      data: formData,
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      },
    })
      .then((r) => {
        const response = r.data.result.text;
        // Playing ringtone and close loader
        playAudio.play();
        setLoading(false);
        // Set audio and text download links valid
        setValidLink(true);
        // add new response to messages Array
        setAssistantMessage([...assistantMessage, response]);
        setLocalFile(false);
        scrollT.scrollTop += 10000;
      })
      .catch((e) => {
        setLoading(false);
        // add new error to messages Array
        setAssistantMessage([
          ...assistantMessage,
          `Uzr xatolik yuzberdi. Iltimos yana urinib ko'ring. Hatolik: ${e}`,
        ]);
        playAudio.play();
        console.log(e);
      });
  };

  // useEffect(() => {
  //   const playAudio = new Audio(ringtone);
  //   if (audioLink && audioFile && audioText && data) {
  //     setAssistantMessage([...assistantMessage, audioText]);
  //     setAudioText(null);
  //     playAudio.play();
  //     setAudioData(false);
  //     setLoading(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [audioLink, audioFile, audioText, assistantMessage, data]);

  // // Starts recording and disables "Yozish" button
  // const start = () => {
  //   startRecording();
  //   setRecording(true);
  //   setStatus("Yozmoqda");
  // };
  // // Staops recording and disables "To'xtatish" button
  // const stop = () => {
  //   stopRecording();
  //   setRecording(false);
  //   setLoading(true);
  //   setStatus("To'xtadi");
  // };

  const getLocalFile = (e) => {
    setLocalAudioFile(e.target.files[0]);
    setLocalFile(true);
    e.target.value = null;
  };

  const [recorder, setRecorder] = useState(null);
  const [chunk, setChunk] = useState(null);
  const [message, setMessage] = useState(null);
  const [spentTime, setSpentTime] = useState(null);
  const [intervalWrapper, setIntervalWrapper] = useState(null);
  const [newMessageWrapper, setNewMessageWrapper] = useState(null);
  const [str, setStr] = useState(null);
  const messageIntervalInMs = 500;

  const { sendMessage, getWebSocket } = useWebSocket(
    "wss://api.oyimqiz.uz/v1/recognize/ws",
    {
      onMessage: (e) => {
        const data = JSON.parse(JSON.parse(JSON.stringify(e.data)));
        const text = data["Nutqdan aniqlangan matn"].text;
        const spentTime = data["Sarflangan vaqt"];
        setMessage(text);
        setSpentTime(spentTime.slice(0, spentTime.length - 7));
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  const sendBuffer = (bufferData) => {
    getWebSocket().binaryType = "blob";
    if (bufferData) {
      sendMessage(bufferData);
    }
  };

  const startRecording = async () => {
    setStatus("Yozmoqda");
    setLoading(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => setStr(stream));
  };

  const stopRecording = async () => {
    setLoading(false);
    setStr(null);
    // str
    //   .getTracks() // get all tracks from the MediaStream
    //   .forEach((track) => track.stop()); // stop each of them
    setStr(null)
    if (recorder) {
      setAssistantMessage([...assistantMessage, newMessageWrapper]);
      clearInterval(intervalWrapper);
      setRecorder(null);
    }
  };

  useEffect(() => {
    if (chunk) {
      sendBuffer(chunk);
      sendMessage("close"); 
    }
    // eslint-disable-next-line
  }, [chunk]);

  useEffect(() => {
    if (!recording) {
      setNewMessageWrapper(null);
      setMessage(null)
    } else {
      if (message) {
        setNewMessageWrapper(message);
        console.log(newMessageWrapper);
      }
    }
  }, [message]);

  useEffect(() => {
    if (str) {
      function record_and_send() {
        const recorder = new MediaRecorder(str);
        setRecorder(recorder);
        recorder.start();
        recorder.ondataavailable = (e) => setChunk(e.data);
        setTimeout(() => {
          recorder.stop();
          setChunk(null)
        }, messageIntervalInMs);
      }

      let messagesInterval = setInterval(record_and_send, messageIntervalInMs);
      setIntervalWrapper(messagesInterval);
    }
  }, [str]);

  return (
    <div className="assistant  bg-gradient-to-r from-[#3b5a8b] to-[#0f172a]">
      <Link to="/">
        <button className="button fixed left-20 ">Bosh sahifa</button>
      </Link>
      {/* Assistant Text Area */}
      <div className="assistant-textarea" id="assistant-textarea">
        {assistantMessage.map((msg, i) => {
          return (
            msg !== "" && (
              <div key={i} className="assistant-message">
                <svg
                  className="mr-2 w-4 h-4 copy-toclipboard"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
                <img src={girl} alt="" />
                <p
                  className="copy-text"
                  onClick={(e) => {
                    navigator.clipboard.writeText(e.target.textContent);
                  }}
                >
                  {msg}
                </p>
              </div>
            )
          );
        })}
        {loading && (
          <div className="assistant-message">
            <svg
              className="mr-2 w-4 h-4 copy-toclipboard"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
            <img src={girl} alt="" />
            <p
              className="copy-text"
              onClick={(e) => {
                navigator.clipboard.writeText(e.target.textContent);
              }}
            >
              {message}
              {loading && <Loader />}
            </p>
          </div>
        )}
        <div
          style={{ height: 200, visibility: "hidden" }}
          className="assistant-message"
        >
          <img src={girl} alt="" />
          <p></p>
        </div>
      </div>
      <div className="assistant-container">
        <div className="assistant-animation">
          <h1>{status} </h1>
          <Circle recording={recording} />
        </div>
        <div className="download-buttons">
          {localFile ? (
            <button
              className="record-button text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handleSave();
                setLoading(true);
              }}
            >
              Audio faylni jo'natish
            </button>
          ) : !recording ? (
            <button
              className="record-button start-stop text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                startRecording();
                setRecording(true);
              }}
            >
              Yozish
            </button>
          ) : (
            <button
              className="record-button start-stop text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                stopRecording();
                setRecording(false);
              }}
            >
              To'xtatish
            </button>
          )}

          <a
            style={{ pointerEvents: validLink ? "auto" : "none" }}
            href={audioLink}
            download={audioLink}
          >
            <button className="record-button save-record text-white font-bold py-2 px-4 rounded">
              Saqlab olish
            </button>
          </a>
          {!localFile ? (
            <div className="addFile ">
              <h1 className="input-label pl-[55px] record-button">
                Fayl joylash
              </h1>
              <input
                className="form-control file-input
                                        audio-file-input
                                        block
                                        w-full
                                        px-3
                                        py-1.5
                                        text-base
                                        font-normal
                                        text-gray-700
                                        bg-ligh-pink bg-clip-padding
                                        border border-solid border-dark-pink-300
                                        rounded
                                        transition
                                        ease-in-out
                                        m-0
                                        focus:text-dark-pink-700 focus:bg-white focus:border-dark-pink-600 focus:outline-none"
                id="audio_file"
                type="file"
                accept=".wav, .ogg, .flac, .mpeg"
                onChange={getLocalFile}
              />
            </div>
          ) : (
            <h1 style={{ textAlign: "center" }} className="input-label">
              Fayl joylandi
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}

// Assistant Circle Svg animation
const Circle = ({ props, recording }) => (
  <svg
    className="assistant-animation-circle"
    viewBox="-150 -150 800 800"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path className="blob" fill="#2ca8da ">
      {!recording && (
        <animate
          attributeName="d"
          dur="3s"
          repeatCount="indefinite"
          values="M447.5,343.5Q399,437,299.5,453.5Q200,470,116.5,412.5Q33,355,34.5,251Q36,147,115.5,78Q195,9,295,38.5Q395,68,445.5,159Q496,250,447.5,343.5Z; M444.45256,345.53163Q402.04744,441.06326,300.51581,458.07117Q198.98419,475.07907,119.03954,413.51581Q39.09489,351.95256,42.62652,252.01581Q46.15815,152.07907,122.6107,88.66606Q199.06326,25.25304,300.58698,42.05535Q402.1107,58.85767,444.48419,154.42883Q486.85767,250,444.45256,345.53163Z; 
            M445,347.5Q406,445,301.5,462.5Q197,480,119,415.5Q41,351,41.5,250.5Q42,150,118.5,78.5Q195,7,299.5,32Q404,57,444,153.5Q484,250,445,347.5Z;
            M447.5,343.5Q399,437,299.5,453.5Q200,470,116.5,412.5Q33,355,34.5,251Q36,147,115.5,78Q195,9,295,38.5Q395,68,445.5,159Q496,250,447.5,343.5Z
            "
        ></animate>
      )}
      {recording && (
        <animate
          attributeName="d"
          dur="15s"
          repeatCount="indefinite"
          values="M468.97969,283.01069Q440.90619,316.02139,438.82166,355.79112Q436.73713,395.56085,409.34483,423.71504Q381.95253,451.86924,344.50417,463.07401Q307.05581,474.27878,268.5023,484.33581Q229.94878,494.39283,196.97792,470.16895Q164.00706,445.94507,137.40676,423.54716Q110.80645,401.14925,91.1399,373.94704Q71.47334,346.74482,45.3202,317.4348Q19.16705,288.12478,12.46577,248.53581Q5.76448,208.94684,24.20953,173.15611Q42.65457,137.36537,67.00386,107.39253Q91.35316,77.41969,129.90134,70.73075Q168.44952,64.04182,200.19969,48.2862Q231.94986,32.53057,266.03324,43.10313Q300.11662,53.67569,335.31103,59.1881Q370.50544,64.70051,401.96663,86.09127Q433.42783,107.48204,440.32599,144.88785Q447.22415,182.29367,472.13867,216.14683Q497.0532,250,468.97969,283.01069Z;M473.28863,284.30599Q449.7066,318.61198,446.77127,359.8533Q443.83594,401.09462,406.38802,416.97005Q368.9401,432.84548,339.71137,460.38802Q310.48264,487.93056,271.54731,475.2934Q232.61198,462.65624,200.48264,449.10416Q168.3533,435.55208,140.48264,417.47005Q112.61198,399.38802,92.24132,372.75868Q71.87066,346.12934,48.54731,316.62934Q25.22396,287.12934,35.63716,251.54731Q46.05035,215.96528,44.02518,176.48264Q42,137,68.24132,109.17665Q94.48264,81.3533,129.5,68.25868Q164.51736,55.16406,197.82335,38.85807Q231.12934,22.55208,269.48264,21.7335Q307.83594,20.91492,342.46528,38.10416Q377.09462,55.2934,397.27604,87.67665Q417.45746,120.0599,437.51736,149.28863Q457.57726,178.51736,477.22396,214.25868Q496.87066,250,473.28863,284.30599Z;M467,284.5Q450,319,434.5,350Q419,381,403,420Q387,459,343,451.5Q299,444,265,463.5Q231,483,196,468.5Q161,454,133.5,430.5Q106,407,68.5,388Q31,369,38,326.5Q45,284,32.5,248Q20,212,33.5,176Q47,140,74,114Q101,88,135,77Q169,66,200.5,49.5Q232,33,268.5,32Q305,31,335,52.5Q365,74,393,95.5Q421,117,447.5,145Q474,173,479,211.5Q484,250,467,284.5Z;M467,284.5Q450,319,434.5,350Q419,381,403,420Q387,459,343,451.5Q299,444,265,463.5Q231,483,196,468.5Q161,454,133.5,430.5Q106,407,68.5,388Q31,369,38,326.5Q45,284,32.5,248Q20,212,33.5,176Q47,140,74,114Q101,88,135,77Q169,66,200.5,49.5Q232,33,268.5,32Q305,31,335,52.5Q365,74,393,95.5Q421,117,447.5,145Q474,173,479,211.5Q484,250,467,284.5Z;
            M471.72966,290.05063Q483.43219,330.10127,448.98644,354.16049Q414.54068,378.21971,389.89873,402.80244Q365.25678,427.38517,335.16049,447.78888Q305.0642,468.19259,268.5,468.28888Q231.9358,468.38517,194.0642,465.5321Q156.19259,462.67902,126.78888,439.14693Q97.38517,415.61483,84.33951,381Q71.29385,346.38517,60.61483,314.72468Q49.9358,283.0642,44.75678,249.0642Q39.57776,215.0642,39.3481,175.60985Q39.11844,136.15551,65.76537,107.3481Q92.41229,78.54068,123.49503,54.94439Q154.57776,31.3481,192.82098,27.52712Q231.0642,23.70615,268.69259,26.21112Q306.32098,28.7161,345.19259,36.79385Q384.0642,44.87161,402.20615,81.39015Q420.3481,117.90868,440.43083,147.85805Q460.51356,177.80741,460.27034,213.90371Q460.02712,250,471.72966,290.05063Z;
            M454.66874,285.19882Q454.19289,320.39763,447.5723,359.78311Q440.9517,399.16859,401.53007,410.67467Q362.10844,422.18074,333.55422,444.12652Q305,466.0723,268.98193,459.32533Q232.96385,452.57837,191.59037,465.01807Q150.21689,477.45778,125.05422,445.28311Q99.89156,413.10844,67.15067,389.67467Q34.40978,366.24089,38.83141,325.58429Q43.25304,284.9277,45.94578,250.44578Q48.63852,215.96385,51.49392,179.81926Q54.34933,143.67467,79.42163,117.56622Q104.49392,91.45778,132.13852,67.47585Q159.78311,43.49392,194.90963,26.98193Q230.03615,10.46993,267.53615,20.71689Q305.03615,30.96385,335.84341,50.99392Q366.65067,71.024,400.05422,89.22889Q433.45778,107.43378,456.3674,139.34341Q479.27703,171.25304,467.21081,210.62652Q455.14459,250,454.66874,285.19882Z;
            M453.22769,283.45538Q444.50461,316.91077,441.32153,356.91077Q438.13846,396.91077,400.45538,409.45538Q362.77231,422,335.43077,450.56462Q308.08923,479.12924,269.77231,477.14925Q231.45538,475.16925,193.43077,470.02Q155.40616,464.87076,121.91077,445.11385Q88.41537,425.35693,73.06462,389.61385Q57.71387,353.87076,37.22769,321.36615Q16.74151,288.86154,25.14767,251.27231Q33.55383,213.68307,46.59384,180.38615Q59.63385,147.08923,84.63385,122.2477Q109.63385,97.40616,138.29231,78.42616Q166.95078,59.44617,198.86154,37.81232Q230.77231,16.17847,270.20308,14.70769Q309.63385,13.23691,343.99539,33.35075Q378.35693,53.4646,406.17847,80.2323Q434,107,455.45538,139.38615Q476.91077,171.77231,469.43077,210.88615Q461.95078,250,453.22769,283.45538Z;
            M460.44249,283.49115Q445.96461,316.9823,441.56194,356.55751Q437.15926,396.13272,403,414.45134Q368.84074,432.76995,337.45134,452.00442Q306.06194,471.2389,268.53097,472.57963Q231,473.92037,194.99115,465.97788Q158.9823,458.03539,130.97788,434.03097Q102.97346,410.02654,82.11945,380.93806Q61.26544,351.84958,55.15042,317.92479Q49.03539,284,48.64157,250.0177Q48.24774,216.03539,59.22562,184.57521Q70.2035,153.11502,91.65484,127.11502Q113.10618,101.11502,138.02654,75.99115Q162.94691,50.86728,197.47346,42.43806Q232,34.00885,271.52654,21.91152Q311.05309,9.81419,348.11502,26.26995Q385.17696,42.72571,412.67254,72.2965Q440.16811,101.86728,454.05751,138.44249Q467.94691,175.0177,471.43364,212.50885Q474.92037,250,460.44249,283.49115Z;
            M468.97969,283.01069Q440.90619,316.02139,438.82166,355.79112Q436.73713,395.56085,409.34483,423.71504Q381.95253,451.86924,344.50417,463.07401Q307.05581,474.27878,268.5023,484.33581Q229.94878,494.39283,196.97792,470.16895Q164.00706,445.94507,137.40676,423.54716Q110.80645,401.14925,91.1399,373.94704Q71.47334,346.74482,45.3202,317.4348Q19.16705,288.12478,12.46577,248.53581Q5.76448,208.94684,24.20953,173.15611Q42.65457,137.36537,67.00386,107.39253Q91.35316,77.41969,129.90134,70.73075Q168.44952,64.04182,200.19969,48.2862Q231.94986,32.53057,266.03324,43.10313Q300.11662,53.67569,335.31103,59.1881Q370.50544,64.70051,401.96663,86.09127Q433.42783,107.48204,440.32599,144.88785Q447.22415,182.29367,472.13867,216.14683Q497.0532,250,468.97969,283.01069Z;
            "
        ></animate>
      )}
    </path>
  </svg>
);

// Loader 3 dots animation
const LoaderWithFrame = () => (
  <div className="assistant-message loader">
    <img
      src={girl}
      alt={`Salom, Men ${process.env.REACT_APP_ASSISTANT_NAME}`}
    />
    <p>
      <svg
        height="15"
        viewBox="0 0 120 30"
        xmlns="http://www.w3.org/2000/svg"
        fill="#2ca8da"
      >
        <circle cx="15" cy="15" r="15">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="0s"
            dur="0.8s"
            values="15;9;15"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fillOpacity"
            from="1"
            to="1"
            begin="0s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="60" cy="15" r="9" fillOpacity="0.3">
          <animate
            attributeName="r"
            from="9"
            to="9"
            begin="0s"
            dur="0.8s"
            values="9;15;9"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fillOpacity"
            from="0.5"
            to="0.5"
            begin="0s"
            dur="0.8s"
            values=".5;1;.5"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="105" cy="15" r="15">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="0s"
            dur="0.8s"
            values="15;9;15"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fillOpacity"
            from="1"
            to="1"
            begin="0s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </p>
  </div>
);

const Loader = () => (
  <svg
    height="15"
    viewBox="0 0 120 30"
    xmlns="http://www.w3.org/2000/svg"
    fill="#2ca8da"
    style={{
      display: "inline",
      transform: "scale(0.3)",
      margin: " 0 0 -5 -15",
      padding: 0,
    }}
  >
    <circle cx="15" cy="15" r="15">
      <animate
        attributeName="r"
        from="15"
        to="15"
        begin="0s"
        dur="0.8s"
        values="15;9;15"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fillOpacity"
        from="1"
        to="1"
        begin="0s"
        dur="0.8s"
        values="1;.5;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="60" cy="15" r="9" fillOpacity="0.3">
      <animate
        attributeName="r"
        from="9"
        to="9"
        begin="0s"
        dur="0.8s"
        values="9;15;9"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fillOpacity"
        from="0.5"
        to="0.5"
        begin="0s"
        dur="0.8s"
        values=".5;1;.5"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="105" cy="15" r="15">
      <animate
        attributeName="r"
        from="15"
        to="15"
        begin="0s"
        dur="0.8s"
        values="15;9;15"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fillOpacity"
        from="1"
        to="1"
        begin="0s"
        dur="0.8s"
        values="1;.5;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
