import { useState } from 'react'
import WebcamCapture from './components/WebcamCapture'
import './global.css'
import Layout from './layouts/layout'
import ResponseBox from './components/ResponseBox';
import { ReviewResponse } from './api/AnalyseImageApi';

function App() {
    const [showWebcam, setShowWebCam] = useState(true);
    const [review, setReview] = useState<ReviewResponse | null>(null);

    return (
        <Layout showReset={!showWebcam} toggleView={() => setShowWebCam(!showWebcam)}>
            {
                showWebcam ? <WebcamCapture toggleView={() => setShowWebCam(!showWebcam)} setReview={(review: ReviewResponse) => setReview(review)} /> : <ResponseBox review={review} />
            }
        </Layout>
    )
}

export default App
