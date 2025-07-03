"use client";
import { useState, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Loader2, Upload, Camera, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function ImageUpload({ open, onOpenChange, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Camera check before opening file input
  const handleTakePhoto = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Camera not available on this device.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // If we get here, camera is available
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      // Now open the file input (which will open the camera UI)
      if (cameraInputRef.current) cameraInputRef.current.click();
    } catch (err) {
      toast.error("Camera not available or permission denied.");
    }
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="w-full max-w-xs sm:max-w-[400px] p-4 sm:p-6 max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>Take a photo or select an image, add a description, and upload.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 w-full">
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
          {/* Hidden file inputs for camera and gallery */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <img src={previewUrl} alt="Preview" className="w-full max-h-48 rounded-lg object-cover" />
            </div>
          )}
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
        </div>
      </DialogContent>
    </Dialog>
  );
} 