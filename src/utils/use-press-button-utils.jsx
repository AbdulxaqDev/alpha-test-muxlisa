export const startRecording = async (setRecorderState) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    setRecorderState((prev) => {
      return {
        ...prev,
        start: true,
        stream,
      };
    });
  } catch (err) {
    console.log(err);
  }
};
export const stopRecording = (recorder) => {
  if (recorder.state !== "inactive") recorder.stop();
};
