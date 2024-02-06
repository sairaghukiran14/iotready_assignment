import React, { useState, useEffect, useRef } from "react";
import bg from "../assets/load.gif";
import wave from "../assets/audio_wave.gif";
import AudioPlayer from "./AudioPlayer";
const CloudinaryTest = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [song, setSong] = useState("");
  const [audioObj, setAudioObj] = useState({});
  const [audioUrl, setAudioUrl] = useState("");
  const [playlist, setPlaylist] = useState(
    JSON.parse(localStorage.getItem("playlist")) || []
  );
  const [isloading, setIsloading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const audioRef = useRef(null);
  const sourceRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
  };
  const playSong = (track) => {
    const s = track.audio_url;
    console.log(s);
    setAudioUrl(s);
    // audioRef.current.currentSrc = s;
    console.log(sourceRef);

    audioRef.current.play();
  };

  const uploadAudio = () => {
    if (audioFile) {
      // Create a FormData object to send the file to Cloudinary
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("upload_preset", "audio_app");

      // Make a POST request to Cloudinary API
      fetch("https://api.cloudinary.com/v1_1/dmqz317kh/auto/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Set the URL of the uploaded audio in the state
          const newTrack = {
            id: Date.now(),
            name: data.original_filename,
            audio_url: data.secure_url,
          };
          setPlaylist([...playlist, newTrack]);

          setAudioObj(data);

          console.log(data);

          //   setAudioname(data.original_filename);
          setIsloading(false);
        })
        .catch((error) => {
          console.error("Error uploading audio:", error);
          alert("Error uploading audio");
        });
      setIsloading(true);
    }
  };

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];
    setPlaylist(storedPlaylist);
  }, []);
  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [playlist]);
  //   const currentTrack = playlist[currentTrackIndex];
  const playNextSong = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length); // Loop back to the first song if at the end
  };
  const handleEnded = () => {
    playNextSong();
  };

  return (
    <div className="upload_section flex justify-around items-center w-full">
      <div className="left_part">
        <div className="input_section bg-white p-2 rounded-lg mb-2">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="text-black"
          />
          <button
            onClick={uploadAudio}
            className="bg-blue-500 rounded-lg text-white p-3"
          >
            Upload Audio
          </button>
        </div>
        {isloading && (
          <img
            src={bg}
            alt=""
            className="rounded-full border-rose-400 border"
          />
        )}

        <div className="playist_section overflow-y-auto">
          <div className="h2 font-semibold text-white mb-2 flex-col">
            Playlist
          </div>
          <div className="songs_section border p-2 rounded-lg">
            {playlist.map((track, index) => (
              <div
                key={track.id}
                onClick={() => playSong(track)}
                className="text-black font-semibold bg-white border rounded-lg p-2 mb-2 cursor-pointer flex justify-between items-center"
              >
                <button>{track.name}</button>
                <div className="playing">
                  <img src={wave} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {audioUrl && (
        <div className="audio_section">
          <h2 className="font-semibold text-white text-center mb-2">
            Playing:
          </h2>
          <audio ref={audioRef} controls onEnded={handleEnded}>
            {/* <source ref={sourceRef} type="audio/mp3" /> */}
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {/* <AudioPlayer song={audioUrl} handleEnded={handleEnded} /> */}
    </div>
  );
};

export default CloudinaryTest;
