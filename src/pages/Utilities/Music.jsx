import AudioPlayer from '@/otherComponents/AudioPlayer';

export default function Music() {
    return (
        <div className="flex justify-center items-center p-20 h-[80vh]">
            <AudioPlayer className='text-gray-600 w-[30%]' audioSrc='/sound1.mp3'/>
        </div>
    )
}