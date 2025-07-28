
import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="flex justify-center items-start h-screen w-screen">
      <div className="flex flex-col items-center w-full m-4">
        <Skeleton className=" w-full h-20 rounded-2xl  bg-gray-200" />
        <Skeleton className="m-3 w-full h-20 rounded-2xl  bg-gray-200" />
        <Skeleton className="w-full h-20 rounded-2xl  bg-gray-200" />
        <Skeleton className="m-3 w-full h-20 rounded-2xl  bg-gray-200" />
        {/* <p className="mt-4 text-gray-500">Loading...</p> */}
      </div>      
    </div>
  );
}
export default Loading
// CSS for the loading spinner