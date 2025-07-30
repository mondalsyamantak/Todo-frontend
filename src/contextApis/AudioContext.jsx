// UserContext.jsx
import { createContext, useContext, useRef, useState } from "react";

const AudioContext = createContext(); // no default value for now

// export function AudinfoProvider({ children }) {
//   const audioRef = useRef(null); // reference to the audio element
//   const [audioInfo, setAudioInfo] = useState({audioSrc: "/sound1.mp3", audioIsPlaying: false }); // shared state

//   return (
//     <AudinfoContext.Provider value={{ audioInfo, setAudioInfo, audioRef }}>
//       {children}
//     </AudinfoContext.Provider>
//   );
// }

export function AudioProvider({ children }) {
  const [audioSrc, setAudioSrc] = useState('/sound1.mp3'); // URL or path to audio
  const [audioIsPlaying, setAudioIsPlaying] = useState(false); // true/false
  const audioRef = useRef(null); // reference to <audio> element

  return (
    <AudioContext.Provider value={{
      audioSrc,
      setAudioSrc,
      audioIsPlaying,
      setAudioIsPlaying,
      audioRef,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

// Custom hook for convenience
export function useAudioInfo() {
  return useContext(AudioContext);
}
