import { analyseImageApi, ReviewResponse } from "@/api/AnalyseImageApi";
import Compressor from "compressorjs";
import { useState, useRef, useEffect } from "react";

type WebcamCaptureProps = {
  toggleView: () => void,
  setReview: (review: ReviewResponse) => void,
}

const WebcamCapture = ({ toggleView, setReview }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const { analyseImage, isLoading } = analyseImageApi();

  const uploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6, // Reduce the image quality (0 to 1)
        success(result) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setCapturedImage(base64data);

            stopWebcam(); // Optionally stop the webcam if an image is uploaded
          }

          reader.readAsDataURL(result);
        },
        error(err) {
          console.error(err.message);
        },
      })
    }
  };

  const imageAnalysis = async () => {
    if (capturedImage) {
      const result = await analyseImage(capturedImage);
      console.log(result);

      if (result.success == true) {
        toggleView();
        console.log(JSON.parse(result.message));
        setReview(JSON.parse(result.message));
      }
    }
  };

  useEffect(() => {
    startWebcam();
  }, [useFrontCamera]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: useFrontCamera ? "user" : "environment",
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        stopWebcam();
      }
    }
  };

  const resetState = () => {
    stopWebcam();
    setCapturedImage(null);
    startWebcam();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-full gap-4 py-8">
      {capturedImage ? (
        <>
          <img
            src={capturedImage}
            className="w-full h-full object-cover rounded-lg flex-1"
            alt="Captured"
          />
          <div className="flex w-full justify-between">
            <button
              onClick={resetState}
              className="bg-black text-white rounded-full px-6 py-2 shadow-md hover:bg-gray-100 font-bold"
            >
              Reset
            </button>
            <button
              onClick={imageAnalysis}
              className="bg-black text-white rounded-full px-6 py-2 shadow-md hover:bg-gray-100 font-bold"
            >
              Analyse
            </button>
          </div>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-lg"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex w-full justify-between ">
            <>
              <button
                onClick={uploadImage}
                className=" stroke-white text-white rounded-full shadow-md px-3 py-3 hover:bg-gray-200"
              >
                <img
                  src="/upload.svg"
                  alt="Take Photo"
                  className="h-6 w-6 stroke-white"
                />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </>

            <div className="flex gap-6">
              <button
                onClick={captureImage}
                className="bg-black stroke-white text-white rounded-full px-3 py-3 hover:bg-gray-800"
              >
                <img
                  src="/camera.svg"
                  alt="Take Photo"
                  className="h-6 w-6 stroke-white"
                />
              </button>
              <button
                onClick={() => setUseFrontCamera(!useFrontCamera)}
                className="bg-black stroke-white text-white rounded-full px-3 py-3 hover:text-gray-600 transition"
              >
                <img
                  src="/refresh-cw.svg"
                  alt="Switch Camera"
                  className="h-6 w-6"
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
