
import Draggable from "react-draggable";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { useRef } from "react";
import { useAudioInfo } from "@/contextApis/AudioContext";

export default function OuterPlayer() {
    //audioInfo has structure: {audioSrc, audioIsPlaying}

    const {audioSrc, setAudioSrc, audioIsPlaying, setAudioIsPlaying, audioRef} = useAudioInfo(); //global context variable storing state of audio
    
    if (!audioRef) {
        audioRef = useRef()
    }
    
    const handlePlay = () => {
        if (!audioSrc) {
            setAudioSrc('/sound1.mp3'); // Set default audio source if not set
        }

        audioRef.current.play()
        setAudioIsPlaying(true) // Update the audio info state
    }

    const handlePause = () => {
        audioRef.current.pause()
        setAudioIsPlaying(false) // Update the audio info state
    }

    const handlePlayPause = () => {
        if (audioIsPlaying) handlePause()
            else handlePlay()
    }
  return (
    <div className="bg-muted/50 z-10 rounded-full">
        <audio ref={audioRef} src={audioSrc} loop/> 
        <Button id="audioButton" className="w-10 h-10 rounded-full" onClick={handlePlayPause}> {audioIsPlaying? <Pause/> : <Play/>} </Button>
    </div>
  );
//     return (
//     <Draggable defaultPosition={{ x: 20, y: window.innerHeight - 100 }}>
//         <div className="fixed bg-muted/50 rounded-full ">
//             <audio ref={audioRef} src={audioSrc} loop/> 
//             <Button id="audioButton" className="w-15 h-15 rounded-full" onClick={handlePlayPause}> {audioIsPlaying? <Pause/> : <Play/>} </Button>
//         </div>
//     </Draggable>
//   );

// return (
//     <Draggable defaultPosition={{ x: 20, y: window.innerHeight - 100 }}>
//       <div style={{ position: "fixed", zIndex: 9999 }}>
//         <Button className="w-10 h-10 rounded-full shadow-lg">
//           ⚙️
//         </Button>
//       </div>
//     </Draggable>
//   );
}