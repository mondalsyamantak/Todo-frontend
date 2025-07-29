import { usePomo } from "@/contextApis/PomoContext";
import { Button } from "@/components/ui/button";
import { Pause, Play, Trash2 } from "lucide-react";
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
    
    const {pomoPause, setPomoPause} = usePomo();

    //const [pomo, setPomo] = useState(false); // whether the timer is running
    const [val, setVal] = useState(0); // elapsed time in ms

    const startRef = useRef(null); // when the timer started

    const pauseElapsedRef = useRef(null) //stores how 

    const intervalRef = useRef(null); // stores setInterval ID

    useEffect(() => {
        //console.log(pomoPause)
        if (!pomoPause.start) pomoPause.start = new Date()
        const now = new Date();
        const elapsed = (now.getTime() - pomoPause.start.getTime()) + pomoPause.value
        setVal(elapsed)
    })
// Setup effect when pomo becomes true
    useEffect(() => {
        if (pomoPause.state) {
            pomoPause.start = new Date(); // initialize start time
            if (![pomoPause.value]) pomoPause.value = 0;
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const elapsed = (now.getTime() - pomoPause.start.getTime()) + pomoPause.value
                setVal(elapsed)
                //console.log(Math.floor(elapsed/1000))
            }, 1);
        }

        return () => {
            clearInterval(intervalRef.current);
        };

    }, [pomoPause.state]);

    const startTimer = () => {
        if (!pomoPause.state) setPomoPause( pomoPause => ({...pomoPause, state: true} )); // assuming this triggers the effect
    };

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        // setPomo(false);
        const now = new Date()
        setPomoPause( pomoPause => ({ 
            state: false,
            value: pomoPause.value + now.getTime() - pomoPause.start.getTime()
        })); 
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        startRef.current = null;
        setPomoPause(pomoPause => ({...pomoPause, state: false, value: null}))
        setVal(0);
        // setPomo(false);
    };



    return (
        <div className="flex flex-col h-[90vh] items-center justify-center gap-6">
            <p className="text-[2rem]">
                {formatTime(val)}
            </p>
            <Button onClick={startTimer} className="w-[30%]"> <Play/> </Button>
            <Button onClick={pauseTimer} className="w-[30%]"> <Pause/> </Button>
            <Button onClick={resetTimer} className="w-[30%]"> <Trash2/> </Button>


        </div>
    )
}
