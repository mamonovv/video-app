import React, {useState} from "react";
import axios, {AxiosRequestConfig} from "axios";

const VideoUpload = () => {
    const [file, setFile] = useState<File | undefined>()
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit() {
        const data = new FormData()

        if (!file) return

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
            await axios.post("/api/videos", data, config)
        } catch (e: any) {
            setError(e.message)
        } finally {
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
        <div>
            {error && <p>{error}</p>}
            {submitting && <p>{progress}</p>}
            <form action={"POST"}>
                <div>
                    <label htmlFor="file">File</label>
                    <input type="file" id={'file'} accept={".mp4"} onChange={handleSetFile}/>
                </div>
            </form>
            <button onClick={handleSubmit}>Upload Video</button>
        </div>
    )
}

export default VideoUpload