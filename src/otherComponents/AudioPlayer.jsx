import { useState, useRef, useEffect } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useAudioInfo } from "@/contextApis/AudioContext";

export default function AudioPlayer(){

    //state variables to manage the player's status
    //const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    //const audioRef = useRef(null);

    const {audioSrc, setAudioSrc, audioIsPlaying, setAudioIsPlaying, audioRef} = useAudioInfo();

    if (!audioRef) {
        audioRef = useRef()
    }

    const handleSeek = (e) => {
        audioRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value)
    }

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration)
    }

    const handlePlay = () => {
        audioRef.current.play()
        setAudioIsPlaying(true)
    }

    const handlePause = () => {
        audioRef.current.pause()
        setAudioIsPlaying(false)
    }

    const handlePlayPause = () => {
        if (audioIsPlaying) handlePause()
            else handlePlay()
    }

    useEffect(() => {
        audioRef.current.addEventListener("timeupdate", handleTimeUpdate)

        return() => {
            if (audioRef.current) audioRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        }
    },[])

    
    return (
        <Card className="flex w-full text-center max-w-[500px]">
            <CardHeader>
                <CardTitle className="text-normal mb-3">
                    
                    <img src="https://fastly.picsum.photos/id/866/536/354.jpg?hmac=tGofDTV7tl2rprappPzKFiZ9vDh5MKj39oa2D--gqhA" 
                    alt="" className="rounded-2xl" />
                </CardTitle >
                <CardDescription className="text-normal">
                Hide CS01 
                </CardDescription>
                <CardContent>
                    <Input className="mt-0 cursor-pointer" type="range" 
                    min="0" 
                    max={duration} 
                    value={currentTime} onChange={handleSeek}/>
                
                {/**the audio element for playing the audio */}

                {/* <audio ref={audioRef} src={audioSrc} loop/> */}


                {/* display current and total duration of the track */}
                <div className="flex">
                    <p className="mr-auto">
                    {
                        Math.floor(parseInt(currentTime) / 60).toString().padStart(2, '0')
                    }:{
                        (parseInt(currentTime) % 60).toString().padStart(2, '0')
                    }
                    </p>
                    {/* <Button onClick = {handlePlayPause} className="rounded-full"> {audioIsPlaying? <Pause/>: <Play/>}</Button> */}
                    <div className="bg-muted/50 rounded-full">
                        <Button id="audioButton" className="w-10 h-10 rounded-full" onClick={handlePlayPause}> {audioIsPlaying? <Pause/> : <Play/>} </Button>
                    </div>
                
                    <p className="ml-auto">{
                        Math.floor(parseInt(duration) / 60).toString().padStart(2, '0')
                    }:{
                        (parseInt(duration) % 60).toString().padStart(2, '0')
                    }</p>


                    
                </div>

                {/* Play/pause button with a dynamic icon */}
                
                </CardContent>
            </CardHeader>
        </Card>
    )
}