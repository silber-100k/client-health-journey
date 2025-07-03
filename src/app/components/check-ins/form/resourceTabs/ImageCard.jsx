import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format, parse } from "date-fns";

function ImageCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] shadow-lg rounded-2xl p-4 flex flex-col items-center border border-[#e5e7eb] animate-pulse">
      <div className="w-full aspect-[3/4] bg-[#e5e7eb] rounded-xl overflow-hidden mb-3 flex items-center justify-center">
        <div className="w-2/3 h-2/3 bg-gray-200 rounded-lg" />
      </div>
      <div className="w-full text-center">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 mx-auto" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );
}

const ImageCard = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/client/selfieImage");
        const data = await response.json();
        if (data.status) {
          setUploadedImages(data.selfieImages);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);
  return (
    <div>
      {loading ? (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      ) : uploadedImages.length > 0 ? (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {uploadedImages.map((img, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] shadow-lg rounded-2xl p-4 flex flex-col items-center border border-[#e5e7eb] hover:shadow-xl transition-shadow duration-200"
            >
              <div className="w-full aspect-[3/4] bg-[#f3f4f6] rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                <img
                  src={img.image}
                  alt={img.description}
                  className="w-full h-full object-cover rounded-xl"
                  style={{ maxHeight: 320 }}
                />
              </div>
              <div className="w-full text-center">
                <div className="text-base font-medium text-gray-800 mb-1 truncate">
                  {img.description || <span className="italic text-gray-400">No description</span>}
                </div>
                <div className="text-xs text-gray-500 font-light">
                {img.date ? format(parse(img.date, "yyyy-MM-dd", new Date()), "PPP") : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageCard;