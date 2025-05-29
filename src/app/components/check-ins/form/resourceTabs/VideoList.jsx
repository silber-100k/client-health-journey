"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

export default function VideoList({ trigger }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [trigger]);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/admin/resource/video");
      const data = await response.json();
      setVideos(data.videos);
    } catch (error) {
      toast.error("Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    try {
      const response = await fetch(`/api/admin/resource/html/${videoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVideos(videos.filter((v) => v.id !== videoId));
        toast.success("Video deleted successfully");
      } else {
        throw new Error("Failed to delete video");
      }
    } catch (error) {
      toast.error("Error deleting video");
    }
  };

  // Download function
  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to download video");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = title || "video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started");
    } catch (error) {
      toast.error("Error downloading video");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos?.map((video) => (
        <div key={video.id} className="border rounded-lg p-4">
          <video
            controls
            className="w-full rounded-lg mb-2"
            src={video.content}
          >
            Your browser does not support the video tag.
          </video>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{video.title}</span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDownload(video.content, video.title)}
              >
                Download
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(video.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
