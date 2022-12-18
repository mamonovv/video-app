import {useRouter} from "next/router";
import React from "react";

function VideoPlayer({id}: { id: string }) {
    const router = useRouter()

    const handlePressBack = () => {
        router.back()
    }

    return (
        <div
            className={'w-screen h-screen bg-slate-500 flex flex-col gap-4 items-center justify-center text-fuchsia-50'}>
            <h1 className={'text-2xl font-bold'}>Enjoy video!</h1>
            <div>
                <video
                    src={`/api/videos?videoId=${id}`}
                    width={"800px"}
                    height={"auto"}
                    controls
                    id={"video-player"}
                    className={'rounded-xl'}
                />
            </div>
            <button onClick={handlePressBack}
                    className={'uppercase rounded-lg cursor-pointer p-4 bg-gray-50 dark:hover:bg-bray-800 ' +
                        'dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ' +
                        'dark:hover:bg-gray-600 mt-4'}>
                Go back to upload page
            </button>
        </div>
    )
}

export default VideoPlayer