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

export default function AudioPlayer({audioSrc}){

    //state variables to manage the player's status
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

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
        setIsPlaying(true)
    }

    const handlePause = () => {
        audioRef.current.pause()
        setIsPlaying(false)
    }

    const handlePlayPause = () => {
        if (isPlaying) handlePause()
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
                Hide CS01 Ambient Rework
                </CardDescription>
                <CardContent>
                    <Input className="mt-0" type="range" 
                    min="0" 
                    max={duration} 
                    value={currentTime} onChange={handleSeek}/>
                
                {/**the audio element for playing the audio */}
                <audio ref={audioRef} src={audioSrc} loop/>

                {/* display current and total duration of the track */}
                <div className="flex">
                    <p className="mr-auto">
                    {
                        Math.floor(parseInt(currentTime) / 60).toString().padStart(2, '0')
                    }:{
                        (parseInt(currentTime) % 60).toString().padStart(2, '0')
                    }
                    </p>
                    <Button onClick = {handlePlayPause} className="rounded-full"> {isPlaying? <Pause/>: <Play/>}</Button>
                
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