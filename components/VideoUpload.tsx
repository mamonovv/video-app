import React, {useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {useRouter} from "next/router";

const VideoUpload = () => {

    const [file, setFile] = useState<File | undefined>()
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter()

    async function handleSubmit() {
        const data = new FormData()

        if (!file) return

        let fileName = ''

        setSubmitting(true)

        data.append('file', file)

        const config: AxiosRequestConfig = {
            onUploadProgress: function (progressEvent) {
                if (progressEvent.total) {
                    const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setProgress(percentComplete)
                }
            }
        }

        try {
            await axios.post("/api/videos", data, config).then((res) => {
                fileName = res.data;
            })
        } catch (e: any) {
            setError(e.message)
        } finally {
            if (!error) {
                await router.push('/videos/' + fileName)
            }
            setSubmitting(false)
            setProgress(0)
        }
    }

    const handleSetFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files

        if (files?.length) {
            setFile(files[0]);
        }
    }

    return (
        <div className={'flex flex-col items-center justify-center h-screen p-10 text-fuchsia-50'}>
            <h1 className={'text-2xl font-bold'}>Chuncked video downloading</h1>

            <div className="flex items-center justify-center w-full mt-8">
                <label htmlFor="file"
                       className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to select file</span> or
                            drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">MP4</p>
                    </div>
                    <input id="file" type="file" className={"hidden"} accept={".mp4"} onChange={handleSetFile}/>
                </label>
            </div>

            {submitting && <p className={'uppercase mt-2'}>progress: {progress}% / 100%</p>}

            {
                file && <p className={'uppercase mt-2'}>File selected</p>
            }

            {
                file && <button onClick={handleSubmit}
                                className={'uppercase rounded-lg cursor-pointer p-4 bg-gray-50 dark:hover:bg-bray-800 ' +
                                    'dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ' +
                                    'dark:hover:bg-gray-600 mt-4'}>
                    Upload video and redirect to video player
                </button>
            }


            {error && <p>{error}</p>}

        </div>
    )
}

export default VideoUpload