import { useState, useRef, useEffect } from "react";

const WebcamCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState(true);

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden">
        {capturedImage ? (
          <>
            <img
              src={capturedImage}
              className="w-full h-[500px] object-cover rounded-lg"
              alt="Captured"
            />
            <button
              onClick={resetState}
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 rounded-full px-6 py-2 shadow-md hover:bg-gray-100"
            >
              Reset
            </button>
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-[500px] object-cover rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={captureImage}
                className=" stroke-white text-white rounded-full shadow-lg px-3 py-3 hover:bg-gray-800"
              >
                <img
                  src="/upload.svg"
                  alt="Take Photo"
                  className="h-6 w-6 stroke-white"
                />
              </button>
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
    </div>
  );
};

export default WebcamCapture;
