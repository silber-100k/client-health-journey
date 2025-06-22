import React, { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Plus, Trash2, Upload, Image as ImageIcon, Search } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

// Image compression and optimization helper functions
const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 1, // Compress to max 1MB
    maxWidthOrHeight: 1000, // Max width or height
    useWebWorker: true, // Use web worker for better performance
    fileType: 'image/jpeg', // Convert to JPEG
    quality: 0.9, // 90% quality
    ...options
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

const validateImageFile = (file) => {
  const maxSize = 20 * 1024 * 1024; // 20MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload only JPEG, PNG, or WebP images.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 20MB.' };
  }
  
  return { valid: true };
};

const NutritionTab = ({ register, errors, formData, setValue, getValues }) => {
  const [uploadingImages, setUploadingImages] = useState({});
  const [analyzingImages, setAnalyzingImages] = useState({});
  const [imageFiles, setImageFiles] = useState({}); // To store compressed file objects

  // Live calories calculation
  useEffect(() => {
    const nutrition = getValues("nutrition") || [];
    const updatedNutrition = nutrition.map((item) => {
      const protein = (item.proteinPortion) || 0;
      const carbs = (item.carbsPortion) || 0;
      const fats = (item.fatsPortion) || 0;
      const calories = (4 * protein + 4 * carbs + 9 * fats);
      return {
        ...item,
        calories: calories ? calories.toFixed(1) : '0',
      };
    });
    setValue("nutrition", updatedNutrition, { shouldValidate: false, shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.nutrition?.length, formData.nutrition?.map(i => `${i.proteinPortion}-${i.carbsPortion}-${i.fatsPortion}`).join(",")]);

  const addNutrition = () => {
    const currentNutrition = getValues("nutrition") || [];
    setValue("nutrition", [
      ...currentNutrition,
      {
        protein: "",
        proteinPortion: "",
        fruit: "",
        fruitPortion: "",
        vegetables: "",
        vegetablesPortion: "",
        carbs: "",
        carbsPortion: "",
        fats: "",
        fatsPortion: "",
        other: "",
        otherPortion: "",
        images: [],
      },
    ], { shouldValidate: true, shouldDirty: true });
  };

  const removeNutrition = (index) => {
    const currentNutrition = getValues("nutrition") || [];
    const newNutrition = currentNutrition.filter((_, i) => i !== index);
    setValue("nutrition", newNutrition, { shouldValidate: true, shouldDirty: true });
  };

  const handleImageUpload = async (e, index) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(prev => ({ ...prev, [index]: true }));
    toast.info("Processing images...");

    try {
      const currentNutrition = getValues("nutrition");
      const updatedNutrition = [...currentNutrition];
      const processedFiles = [];
      const newImageUrls = [];

      // Process each file
      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          continue;
        }

        // Compress image if it's large
        let processedFile = file;
        if (file.size > 2 * 1024 * 1024) { // Compress if larger than 2MB
          try {
            processedFile = await compressImage(file);
            const originalSize = (file.size / 1024 / 1024).toFixed(1);
            const compressedSize = (processedFile.size / 1024 / 1024).toFixed(1);
            toast.info(`Compressed ${file.name}: ${originalSize}MB → ${compressedSize}MB`);
          } catch (compressionError) {
            console.error('Compression failed for', file.name, compressionError);
            toast.warning(`Could not compress ${file.name}, using original file`);
            processedFile = file;
          }
        }

        processedFiles.push(processedFile);
        newImageUrls.push(URL.createObjectURL(processedFile));
      }

      if (processedFiles.length === 0) {
        toast.error("No valid images to upload");
        return;
      }

      updatedNutrition[index] = {
        ...updatedNutrition[index],
        images: [...(updatedNutrition[index].images || []), ...newImageUrls],
      };

      // Store the actual compressed file objects
      setImageFiles(prev => ({
        ...prev,
        [index]: [...(prev[index] || []), ...processedFiles]
      }));

      setValue("nutrition", updatedNutrition, { shouldValidate: true, shouldDirty: true });
      toast.success(`${processedFiles.length} image(s) processed and uploaded successfully!`);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process images');
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  const analyzeImages = async (index) => {
    const filesToAnalyze = imageFiles[index];
    
    if (!filesToAnalyze || filesToAnalyze.length === 0) {
      toast.error('No images to analyze. Please upload images first.');
      return;
    }

    setAnalyzingImages(prev => ({ ...prev, [index]: true }));

    try {
      const formData = new FormData();
      filesToAnalyze.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/client/analyze-food-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze images');

      const result = await response.json();
      
      const currentNutrition = getValues("nutrition");
      const updatedNutrition = [...currentNutrition];
      updatedNutrition[index] = {
        ...updatedNutrition[index],
        protein: result.proteinList || "",
        proteinPortion: String(result.protein || 0),
        vegetables: result.vegetablesList || "",
        vegetablesPortion: String(result.vegetables || 0),
        carbs: result.carbsList || "",
        carbsPortion: String(result.carbs || 0),
        fats: result.fatList || "",
        fatsPortion: String(result.fat || 0),
        fruit: result.fruitList || "",
        fruitPortion: String(result.fruit || 0),
        other: result.otherList || "",
        otherPortion: String(result.other || 0),
      };

      setValue("nutrition", updatedNutrition, { shouldValidate: true, shouldDirty: true });
      toast.success("Food analysis completed successfully!");
    } catch (error) {
      console.error('Error analyzing images:', error);
      toast.error('Failed to analyze images');
    } finally {
      setAnalyzingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  const removeImage = (nutritionIndex, imageIndex) => {
    const currentNutrition = getValues("nutrition");
    const updatedNutrition = [...currentNutrition];
    updatedNutrition[nutritionIndex].images.splice(imageIndex, 1);
    
    // Also remove from our file state
    const updatedImageFiles = {...imageFiles};
    if (updatedImageFiles[nutritionIndex]) {
      updatedImageFiles[nutritionIndex].splice(imageIndex, 1);
      setImageFiles(updatedImageFiles);
    }

    setValue("nutrition", updatedNutrition, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Nutrition</h3>
          <Button type="button" onClick={addNutrition}>
            <Plus className="mr-2 h-4 w-4" /> Add Nutrition Entry
          </Button>
        </div>
        
        {(formData.nutrition || []).map((item, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeNutrition(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {/* Image Upload Section */}
            <div className="mb-4">
              <Label>Food Images</Label>
              <div className="mt-2">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, index)}
                    className="hidden"
                    id={`food-images-${index}`}
                  />
                  <Label
                    htmlFor={`food-images-${index}`}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </Label>
                  {uploadingImages[index] && (
                    <span className="text-sm text-gray-500">Processing images...</span>
                  )}
                  {item.images && item.images.length > 0 && (
                    <Button
                      type="button"
                      onClick={() => analyzeImages(index)}
                      disabled={analyzingImages[index]}
                      className="flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      {analyzingImages[index] ? 'Analyzing...' : 'Analyze Images'}
                    </Button>
                  )}
                </div>
                
                {/* Image Preview Grid */}
                {item.images && item.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {item.images.map((imageUrl, imageIndex) => (
                      <div key={imageIndex} className="relative group">
                        <Image
                          src={imageUrl}
                          alt={`Food image ${imageIndex + 1}`}
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index, imageIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Protein</Label>
                <Textarea
                  {...register(`nutrition.${index}.protein`)}
                  placeholder="What protein did you have?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.proteinPortion`)}
                  type="number"
                  step="0.01"
                  placeholder="Portion (g)"
                />
              </div>

              <div>
                <Label>Fruits</Label>
                <Textarea
                  {...register(`nutrition.${index}.fruit`)}
                  placeholder="What fruits did you have? (e.g., apple, banana, orange)"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.fruitPortion`)}
                  type="number"
                  step="0.01"
                  placeholder="Portion (g)"
                />
              </div>

              <div>
                <Label>Vegetables</Label>
                <Textarea
                  {...register(`nutrition.${index}.vegetables`)}
                  placeholder="What vegetables did you have?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.vegetablesPortion`)}
                  type="number"
                  step="0.01"
                  placeholder="Portion (g)"
                />
              </div>

              <div>
                <Label>Carbohydrates (Grains, Pasta, etc.)</Label>
                <Textarea
                  {...register(`nutrition.${index}.carbs`)}
                  placeholder="What carbohydrates did you have? (e.g., rice, bread, pasta)"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.carbsPortion`)}
                  type="number"
                  step="0.01"
                  placeholder="Portion (g)"
                />
              </div>

              <div>
                <Label>Fats</Label>
                <Textarea
                  {...register(`nutrition.${index}.fats`)}
                  placeholder="What fats did you have?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.fatsPortion`)}
                  type="number"
                  step="0.01"
                  placeholder="Portion (g)"
                />
              </div>

              <div>
                <Label>Other</Label>
                <Textarea
                  {...register(`nutrition.${index}.other`)}
                  placeholder="Any other food items?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.otherPortion`)}
                  type="number"
                  step="0.01"
                  placeholder="Portion (g)"
                />
              </div>

              {/* Calories Field */}
              <div>
                <Label>Calories</Label>
                <Input
                  {...register(`nutrition.${index}.calories`)}
                  type="number"
                  step="0.01"
                  placeholder="Calories"
                  value={item.calories || ''}
                  readOnly
                  tabIndex={-1}
                  style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionTab;
