import type {NextPage} from 'next'
import Head from 'next/head'
import VideoUpload from "../components/VideoUpload";

const Home: NextPage = () => {
    return (
        <div className={'w-screen h-screen bg-slate-500 flex justify-center'}>
            <Head>
                <title>Video app</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={'container'}>
                <VideoUpload/>
            </main>
        </div>
    )
}

export default Home
