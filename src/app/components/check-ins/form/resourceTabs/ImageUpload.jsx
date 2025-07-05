"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Loader2, Upload, Camera, Image as ImageIcon, X, RotateCcw, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function ImageUpload({ open, onOpenChange, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [currentCamera, setCurrentCamera] = useState("environment"); // "environment" (back) or "user" (front)
  const [availableCameras, setAvailableCameras] = useState([]);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryInputRef = useRef(null);
  let streamRef = useRef(null);

  // Detect available cameras
  useEffect(() => {
    const detectCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
      } catch (err) {
        console.log('Could not enumerate devices:', err);
      }
    };
    
    if (showCamera) {
      detectCameras();
    }
  }, [showCamera]);

  // Start camera stream when showCamera is true or camera changes
  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [showCamera, currentCamera]);

  const startCamera = async () => {
    setIsLoadingCamera(true);
    setCameraError("");
    
    try {
      // Stop existing stream if any
      stopCamera();
      
      // Try to get camera stream with current facing mode
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: currentCamera,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
      } catch (facingModeError) {
        // If facing mode fails, try with any available camera
        console.log('Facing mode failed, trying any camera:', facingModeError);
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError("Camera not available or permission denied.");
      setShowCamera(false);
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const switchCamera = async () => {
    try {
      const newCamera = currentCamera === "environment" ? "user" : "environment";
      setCurrentCamera(newCamera);
      
      // Show a brief toast to indicate camera switching
      toast.info(`Switching to ${newCamera === "environment" ? "back" : "front"} camera...`);
    } catch (error) {
      console.error('Error switching camera:', error);
      toast.error('Failed to switch camera');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Open custom camera modal
  const handleTakePhoto = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Camera not available on this device.");
      return;
    }
    setCameraError("");
    setShowCamera(true);
  };

  // Capture photo from video stream
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        setSelectedFile(new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" }));
        setPreviewUrl(URL.createObjectURL(blob));
        setShowCamera(false);
      }
    }, "image/jpeg", 0.95);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("description", description);
      const current = new Date();
      formData.append("date", current);
      // Upload to your API endpoint
      const response = await fetch("/api/admin/resource/image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status && data.url) {
        toast.success("Image uploaded successfully");
        onUpload({ url: data.url, description });
        setSelectedFile(null);
        setPreviewUrl(null);
        setDescription("");
        onOpenChange(false);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription("");
    setShowCamera(false);
    setCameraError("");
    setCurrentCamera("environment"); // Reset to back camera
    setAvailableCameras([]);
    setIsLoadingCamera(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        className="w-full max-w-[95vw] sm:max-w-[400px] p-2 sm:p-6 max-h-[95vh] sm:max-h-[100vh] overflow-y-auto overflow-x-hidden"
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(80, 80, 120, 0.15)',
          margin: 0,
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>Take a photo or select an image, add a description, and upload.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 w-full">
          {/* Camera Modal */}
          {showCamera && (
            <div className="flex flex-col items-center space-y-2 w-full">
              <div className="w-full flex justify-center relative">
                {isLoadingCamera && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-10">
                    <div className="flex items-center gap-2 text-white">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Loading camera...</span>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  className="rounded-lg bg-black"
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    maxWidth: '100vw',
                    height: 'auto',
                    aspectRatio: '3/4',
                    maxHeight: '60vh',
                    objectFit: 'cover',
                    background: '#000',
                  }}
                />
                {/* Camera switching button - only show if multiple cameras available */}
                {availableCameras.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={switchCamera}
                    disabled={isLoadingCamera}
                    className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 z-20"
                    style={{ minWidth: 'auto', padding: '8px' }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
                {/* Camera indicator */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
                  <Smartphone className="h-3 w-3 inline mr-1" />
                  {currentCamera === "environment" ? "Back Camera" : "Front Camera"}
                </div>
              </div>
              <div className="flex gap-2 w-full mt-2">
                <Button 
                  type="button" 
                  onClick={handleCapture} 
                  disabled={isLoadingCamera}
                  className="flex-1 flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" /> Capture
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCamera(false)} 
                  className="flex-1 flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}
          {!showCamera && (
            <>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTakePhoto}
                  className="flex-1 flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" /> Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                  className="flex-1 flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" /> Choose from Gallery
                </Button>
              </div>
              {/* Hidden file input for gallery */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              {cameraError && <div className="text-red-500 text-sm mt-2">{cameraError}</div>}
              {availableCameras.length > 1 && (
                <div className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  {availableCameras.length} camera{availableCameras.length > 1 ? 's' : ''} detected - tap the rotate button to switch
                </div>
              )}
            </>
          )}
          {previewUrl && !showCamera && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <img src={previewUrl} alt="Preview" className="w-full max-h-48 rounded-lg object-cover" style={{ maxWidth: '100vw', height: 'auto' }} />
            </div>
          )}
          {!showCamera && (
            <>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Add a description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 w-full">
                <Button
                  onClick={handleUpload}
                  disabled={isSubmitting || !selectedFile}
                  className="flex items-center w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? "Uploading..." : "Upload Image"}
                </Button>
                <Button onClick={handleDialogClose} variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 