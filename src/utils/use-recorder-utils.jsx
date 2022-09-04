


import { useEffect, useState } from "react";
import { startRecording, stopRecording } from "./use-press-button-utils";
import axios from "axios";

const initialState = {
  stream: null,
  recorder: null,
  start: false,
  audio: null,
  text: null,
  audioUrl: null,
};

export default function useRecorder() {
  let soundDet = false;
  const [audioData, setAudioData] = useState(false)
  const [recorderState, setRecorderState] = useState(initialState);

  useEffect(() => {
    if (recorderState.stream) {
      const MIN_DECIBELS = -45;
      const audioContext = new AudioContext();
      const audioStreamSource = audioContext.createMediaStreamSource(recorderState.stream);
      const analyser = audioContext.createAnalyser();
      analyser.minDecibels = MIN_DECIBELS;
      audioStreamSource.connect(analyser);
      const bufferLength = analyser.frequencyBinCount;
      const domainData = new Uint8Array(bufferLength);

      let number = 0
      soundDet = false;

      const detectSound = () => {
        number++

        if (soundDet) {
          setAudioData(true)
          return;
        }
        analyser.getByteFrequencyData(domainData);
        for (let i = 0; i < bufferLength; i++) {
          if (domainData[i] > 0) {
            soundDet = true
          }
        }
        if (number < bufferLength) {
          window.requestAnimationFrame(detectSound);
        }
      }
      window.requestAnimationFrame(detectSound);
    }
  }, [recorderState.stream])


  useEffect(() => {
    if (recorderState.stream) {
      setRecorderState((prev) => {
        return {
          ...prev,
          recorder: new MediaRecorder(prev.stream),
        };
      });
    }
  }, [recorderState.stream]);

  useEffect(() => {
    const recorder = recorderState.recorder;
    let chunks = [];

    if (recorder && recorder.state === "inactive") {
      recorder.start();

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav; codecs=MS_PCM" });
        chunks = [];
        const audioFile = new File([blob], "voice.wav", { type: "audio/wav" });
        const audioFileUrl = URL.createObjectURL(blob);

        setRecorderState((prev) => {
          if (prev.recorder)
            return {
              ...initialState,
              text: prev.text,
              audio: audioFile,
              audioUrl: audioFileUrl
            };
          else return initialState;
        });
      };
    }

    return () => {
      if (recorder)
        recorder.stream.getAudioTracks().forEach((track) => track.stop());
    };
  }, [recorderState.recorder]);



  useEffect(() => {

    if (recorderState.audio && audioData) {
      const formData = new FormData();
      formData.append("file", recorderState.audio);
      axios({
        method: "POST",
        url: "https://api.oyimqiz.uz/v1/recognize/",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((data) => {
          setRecorderState((prev) => {
            return {
              ...initialState,
              text: data.data.result?.text,
            };
          });
          setAudioData(false)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [recorderState.audio,audioData]);

  return {
    recorderState,
    startRecording: () => startRecording(setRecorderState),
    stopRecording: () => stopRecording(recorderState.recorder),
    audioData,
    setAudioData
  };
}
