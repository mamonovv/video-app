// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import busboy from 'busboy'
import * as fs from "fs";

export const config = {
    api: {
        bodyParser: false
    }
}

function uploadVideoStream(req: NextApiRequest, res: NextApiResponse) {
    const bb = busboy({headers: req.headers})

    bb.on('file', (_, file, info) => {

        //auth-api.mp4
        const fileName = info.filename
        const filePath = `./videos/${fileName}`

        const stream = fs.createWriteStream(filePath)

        file.pipe(stream)
    })

    bb.on('close', () => {
        res.writeHead(200, {Connection: 'close'})
        res.end("That's the end")
    })

    req.pipe(bb)
    return
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const method = req.method;

    if (method === 'GET') {
        res.status(200).json({name: 'John Doe'})
    }

    if (method === 'POST') {
        return uploadVideoStream(req, res)
    }

    return res.status(405).json({error: `Method ${method} is not allowed!`})
}

