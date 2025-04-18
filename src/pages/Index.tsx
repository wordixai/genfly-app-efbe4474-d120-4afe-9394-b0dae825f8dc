import { useState, useRef } from 'react';
import { Camera, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not access camera',
        variant: 'destructive'
      });
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/png');
    setImageData(imageUrl);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const downloadImage = () => {
    if (!imageData) return;
    
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'screenshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Screenshot to Image Converter</h1>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            {!stream ? (
              <Button onClick={startCamera}>
                <Camera className="mr-2 h-4 w-4" /> Start Camera
              </Button>
            ) : (
              <>
                <Button onClick={captureImage}>
                  <Camera className="mr-2 h-4 w-4" /> Capture
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Stop Camera
                </Button>
              </>
            )}
          </div>

          {stream && (
            <div className="border rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full"
              />
            </div>
          )}

          {imageData && (
            <div className="space-y-2">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={imageData} 
                  alt="Captured" 
                  className="w-full"
                />
              </div>
              <Button onClick={downloadImage}>
                <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default Index;