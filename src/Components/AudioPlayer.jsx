import React, { useEffect } from "react";

const AudioPlayer = ({ audio_url, handleEnded }) => {
  useEffect(() => {}, [audio_url]);
  console.log(audio_url);
  return (
    <div className="audio_section">
      <h2 className="font-semibold text-white text-center mb-2">Playing:</h2>
      <audio controls onEnded={handleEnded}>
        <source src={audio_url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
