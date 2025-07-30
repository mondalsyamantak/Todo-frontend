
import { Button } from "@/components/ui/button";
import { Pause, Play, Redo, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
  
    const pad = (n, z = 2) => String(n).padStart(z, '0');
  
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds, 3)}`;
  }
  

export default function Pomodoro() {
    
    // const {pomoPause, usePomoPause} = usePomo();

    const [pomo, setPomo] = useState(false); // whether the timer is running
    const [val, setVal] = useState(0); // elapsed time in ms

    const startRef = useRef(null); // when the timer started

    const pauseElapsedRef = useRef(null) //stores how 

    const intervalRef = useRef(null); // stores setInterval ID


// Setup effect when pomo becomes true
    useEffect(() => {
        if (pomo) {
            startRef.current = new Date(); // initialize start time
            if (!pauseElapsedRef.current) pauseElapsedRef.current = 0;
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const elapsed = (now.getTime() - startRef.current.getTime()) + pauseElapsedRef.current
                setVal(elapsed)
            }, 1);
        }

        return () => {
            clearInterval(intervalRef.current);
        };

    }, [pomo]);

    const startTimer = () => {
        if (!pomo) setPomo(true); // assuming this triggers the effect
    };

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        setPomo(false);
        const now = new Date()
        pauseElapsedRef.current += now.getTime() - startRef.current.getTime(); 
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        startRef.current = null;
        pauseElapsedRef.current = null;
        setVal(0);
        setPomo(false);
    };



    return (
        <div className="flex flex-col h-[90vh] items-center justify-center gap-6">
            <p className={ pomo? " text-green-500" : ""}>Focus mode: {pomo? "ON" : "OFF"}</p>
            <p className="text-[2rem]">
                {formatTime(val)}
            </p>
            <Button onClick={ (pomo)? pauseTimer : startTimer } className="w-[30%]"> { pomo? <Pause/> : <Play/>}</Button>
            <Button onClick={resetTimer} className="w-[30%]"> <Redo/> </Button>


        </div>
    )
}
