import { useState, useEffect, useRef } from "react";
import bg from "../assets/load.gif";
import wave from "../assets/audio_wave.gif";

const CloudinaryTest2 = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");
  const audioRef = useRef(null);
  const [playlist, setPlaylist] = useState(
    JSON.parse(localStorage.getItem("playlist")) || []
  );
  const [lastplayedIndex, setLastplayedIndex] = useState(
    JSON.parse(localStorage.getItem("lastplayedIndex")) || 0
  );
  const [isloading, setIsloading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
  };

  const playSong = (track, index) => {
    setCurrentTrackIndex(index);
    setLastplayedIndex(index);
    const s = track.audio_url;
    setSelectedFile(s);
    console.log(audioRef.current, "audio ref");
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

  const playNextSong = () => {
    let i = currentTrackIndex;
    i = (i + 1) % playlist.length;
    console.log(i, "I");
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);

    const track = playlist[i];
    setLastplayedIndex(i);
    console.log(track, "TRACK");
    const s = track.audio_url;
    setSelectedFile(s);
    console.log(audioRef.current, "Play NEXT");
  };

  useEffect(() => {
    setCurrentTrackIndex(JSON.parse(localStorage.getItem(lastplayedIndex)));
  }, []);
  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];
    setPlaylist(storedPlaylist);
  }, []);

  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [playlist, currentTrackIndex]);

  useEffect(() => {
    
    if (selectedFile?.length > 0) {
      console.log(audioRef.current, "AUDIO REF");
      audioRef.current.play();
      localStorage.setItem("lastplayedIndex", JSON.stringify(lastplayedIndex));
    }
  }, [selectedFile, currentTrackIndex]);

  useEffect(() => {
    setSelectedFile(
      playlist[JSON.parse(localStorage.getItem("lastplayedIndex"))]?.audio_url
    );
    setCurrentTrackIndex(JSON.parse(localStorage.getItem("lastplayedIndex")));
  }, []);

  return (
    <div className="upload_section flex justify-around items-center w-full">
      <div className="left_part">
        <div className="input_section bg-white p-2 rounded-lg mb-2 ">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="text-black"
          />
          <button
            onClick={uploadAudio}
            className="bg-blue-500 rounded-lg text-white p-3 mt-3"
          >
            Upload Audio
          </button>
        </div>
        {isloading && (
          <div className="imageloading flex w-full justify-center items-center">
            <img src={bg} alt="" className="rounded-full  border" />
          </div>
        )}

        <div className="playist_section overflow-y-auto">
          <div className="h2 font-semibold text-white mb-2 flex-col">
            Playlist
          </div>
          <div className="songs_section border p-2 rounded-lg">
            {playlist?.length > 0 && (
              <div>
                <ul>
                  {playlist.map((track, index) => (
                    <li
                      key={track.id}
                      onClick={() => playSong(track, index)}
                      className="text-black font-semibold bg-white border rounded-lg p-2 mb-2 cursor-pointer flex justify-between items-center"
                    >
                      <button>{track.name}</button>
                      <div className="playing">
                        {currentTrackIndex === index ? (
                          <img src={wave} alt="" />
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {selectedFile && (
            <div className="mt-6 w-full flex items-center justify-center">
              <audio
                ref={audioRef}
                src={selectedFile}
                controls
                onEnded={playNextSong}
              ></audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryTest2;
