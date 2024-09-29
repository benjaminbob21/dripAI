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
          facingMode: useFrontCamera == true ? "user" : "environment", // Request the front camera (selfie camera)
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

  // Function to stop the webcam
  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video stream
      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame onto canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data URL from canvas
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        console.log(imageDataUrl);

        // Set the captured image
        setCapturedImage(imageDataUrl);

        // Stop the webcam
        stopWebcam();
      }
    }
  };

  // Function to reset state (clear media stream and refs)
  const resetState = () => {
    stopWebcam(); // Stop the webcam if it's active
    setCapturedImage(null); // Reset captured image
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {capturedImage ? (
        <>
          <img
            src={capturedImage}
            className="w-full rounded-lg md:h-screen md:object-cover md:rounded-none"
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
            className="w-full rounded-lg md:h-screen md:object-cover md:rounded-none"
          />
          <canvas ref={canvasRef} className="hidden" />
          {!videoRef.current ? (
            <button
              onClick={startWebcam}
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-full px-6 py-2 shadow-md hover:bg-gray-700"
            >
              Start Webcam
            </button>
          ) : (
            <>
              <button onClick={() => setUseFrontCamera(!useFrontCamera)}>
                <img src="/refresh-cw.svg" />
              </button>
              <button
                onClick={captureImage}
                className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 rounded-full px-6 py-2 shadow-md hover:bg-gray-100"
              >
                Capture Image
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
