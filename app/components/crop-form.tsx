/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState, useRef, ChangeEvent } from "react";
import { AiFillFolderAdd } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/**
 * ImageCropper Component
 * Allows users to crop an image and returns the cropped image as a base64 string.
 *
 * @param onCrop - Callback function that handles the cropped image as a base64 string.
 * @param onClose - Callback function triggered when the cropping process is canceled.
 */
export function ImageCropper({
  onCrop,
  onClose,
}: {
  onCrop: (croppedImage: string) => void;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for file input
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image element
  const [src, setSrc] = useState<string | null>(null); // Source of the image
  const [cropVariable, setCropVariable] = useState<Crop>({
    unit: "px",
    width: 500,
    height: 250,
    x: 0,
    y: 0,
  });

  /**
   * Crop the currently selected image based on the specified crop area.
   * Converts the cropped area into a base64 image string.
   */
  const cropImage = () => {
    if (!imgRef.current || !cropVariable.width || !cropVariable.height) {
      toast({
        title: "Error",
        description: "Please select a valid image.",
        variant: "destructive",
      });
      return;
    }

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast({
        title: "Error",
        description: "Failed to crop the image. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Validate minimum image dimensions
    if (image.naturalWidth < 500 || image.naturalHeight < 250) {
      toast({
        title: "Error",
        description: "The image is too small. Minimum size is 500x250 pixels.",
        variant: "destructive",
      });
      return;
    }

    // Configure canvas for cropping
    canvas.width = cropVariable.width;
    canvas.height = cropVariable.height;

    // Draw cropped image on canvas
    ctx.drawImage(
      image,
      cropVariable.x! * scaleX,
      cropVariable.y! * scaleY,
      cropVariable.width * scaleX,
      cropVariable.height * scaleY,
      0,
      0,
      cropVariable.width,
      cropVariable.height
    );

    // Generate cropped image as base64
    const base64Image = canvas.toDataURL("image/jpeg");
    onCrop(base64Image);
  };

  /**
   * Trigger the hidden file input for selecting an image.
   */
  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handle file input change and validate the selected image.
   *
   * @param e - Change event from the file input.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file size (max 2MB)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        toast({
          title: "Error",
          description: "The file size is too large. Maximum size is 2MB.",
          variant: "destructive",
        });
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      // Read file and validate image dimensions
      reader.onload = () => {
        if (reader.result) {
          img.src = reader.result.toString();
          img.onload = () => {
            if (img.naturalWidth < 500 || img.naturalHeight < 250) {
              toast({
                title: "Error",
                description:
                  "The image is too small. Minimum size is 500x250 pixels.",
                variant: "destructive",
              });
              return;
            }
            setSrc(reader.result?.toString() || null);
          };
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button onClick={handleSelectImage} className="gap-2">
          <AiFillFolderAdd />
          Select image
        </Button>
        <input
          onChange={handleFileChange}
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
        />

        <Button onClick={cropImage} className="gap-2">
          <FaSave className="w-4 h-4" />
          Save
        </Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </div>

      {/* Image Cropper */}
      {src && (
        <ReactCrop
          crop={cropVariable}
          onChange={(newCrop) => setCropVariable(newCrop)}
          aspect={16 / 9}
        >
          <img src={src} alt="" ref={imgRef} />
        </ReactCrop>
      )}
    </div>
  );
}
