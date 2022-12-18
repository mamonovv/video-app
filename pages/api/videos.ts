// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import busboy from 'busboy'
import * as fs from "fs";
import CryptoJS from "crypto-js";

export const config = {
    api: {
        bodyParser: false
    }
}

const CHUNK_SIZE_IN_BYTES = 1000000 // ~1MB

const getHashedFileName = (fileInfo: any) => {
    const fileString = fileInfo.filename + fileInfo.encoding + fileInfo.mimeType

    return CryptoJS.MD5(fileString).toString()
}

const getExtension = (fileName: string) => {
    return fileName.split('.').reverse()[0]
}

function uploadVideoStream(req: NextApiRequest, res: NextApiResponse) {
    const bb = busboy({headers: req.headers})
    let fileName = ''

    bb.on('file', (_, file, info) => {

        console.log(info);
        fileName = getHashedFileName(info)

        const fileExtension = getExtension(info.filename)
        const filePath = `./videos/${fileName}.${fileExtension}`

        const stream = fs.createWriteStream(filePath)

        file.pipe(stream)
    })

    bb.on('close', () => {
        res.writeHead(200, {Connection: 'close'})
        res.end(fileName)
    })

    req.pipe(bb)
    return
}

function getVideoStream(req: NextApiRequest, res: NextApiResponse) {
    const range = req.headers.range

    if (!range) {
        return res.status(400).send('Range must be provided!')
    }
    const videoId = req.query.videoId
    const videoPath = `./videos/${videoId}.mp4`
    const videoSizeInBytes = fs.statSync(videoPath).size

    const chunkStart = Number(range.replace(/\D/g, ""))
    const chunkEnd = Math.min(
        chunkStart + CHUNK_SIZE_IN_BYTES,
        videoSizeInBytes - 1
    )
    const contentLength = chunkEnd - chunkStart + 1

    const headers = {
        'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': "video/mp4",
    }

    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, {
        start: chunkStart,
        end: chunkEnd
    })

    videoStream.pipe(res)
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const method = req.method;

    if (method === 'GET') {
        getVideoStream(req, res)
    }

    if (method === 'POST') {
        return uploadVideoStream(req, res)
    }

    return res.status(405).json({error: `Method ${method} is not allowed!`})
}

