/* eslint-disable @next/next/no-img-element */
// Import necessary components and dependencies
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";
import { useRef, useState } from "react";
import ReactSignatureCanvas from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { RiResetLeftFill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { Description } from "@radix-ui/react-dialog";
import { ImageCropper } from "./crop-form";

interface SignatureFormProps {
  /**
   * The current signature as a base64 string or null if no signature is available.
   */
  signature: string | null;

  /**
   * Callback function to handle changes to the signature.
   * @param fileUrl - The new signature as a base64 string or null.
   */
  onSignatureChange: (fileUrl: string | null) => void;
}

/**
 * SignatureForm Component
 * Provides options for users to either draw or upload a signature.
 *
 * @param signature - Current signature as a base64 string or null.
 * @param onSignatureChange - Callback to handle signature changes.
 */
export default function SignatureForm({
  signature,
  onSignatureChange,
}: SignatureFormProps) {
  const [isOpenDraw, setIsOpenDraw] = useState(false); // State for controlling the draw dialog
  const [isOpenCrop, setIsOpenCrop] = useState(false); // State for controlling the crop dialog

  /**
   * Handles saving the drawn signature.
   * @param fileUrl - The signature image as a base64 string.
   */
  const handleSave = (fileUrl: string) => {
    onSignatureChange(fileUrl);
    setIsOpenDraw(false);
  };

  /**
   * Closes the drawing dialog.
   */
  const handleDrawClose = () => {
    setIsOpenDraw(false);
  };

  /**
   * Closes the cropping dialog.
   */
  const handleCropClose = () => {
    setIsOpenCrop(false);
  };

  /**
   * Handles saving the cropped image.
   * @param croppedImage - The cropped image as a base64 string.
   */
  const handleCrop = (croppedImage: string) => {
    onSignatureChange(croppedImage);
  };

  return (
    <>
      {/* Buttons for drawing or uploading a signature */}
      <div className="flex flex-col space-y-4">
        <SignaturePad
          onSave={handleSave}
          onClose={handleDrawClose}
          isOpenDraw={isOpenDraw}
          setIsOpenDraw={setIsOpenDraw}
        />

        <Dialog open={isOpenCrop} onOpenChange={setIsOpenCrop}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MdOutlineDriveFolderUpload className="w-4 h-4" />
              Upload Signature
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] overscroll-auto">
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <Description className="text-sm text-gray-500">
              Please upload and crop an image with dimensions 500x250 pixels.
            </Description>
            <ImageCropper onCrop={handleCrop} onClose={handleCropClose} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Display the current signature */}
      {signature && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Signature:</h3>
          <img src={signature} alt="Signature" className="border rounded-md" />
        </div>
      )}
    </>
  );
}

interface SignaturePadProps {
  /**
   * Callback function to handle the saved signature data as a base64 string.
   */
  onSave: (dataURL: string) => void;

  /**
   * Callback function to close the signature pad.
   */
  onClose: () => void;

  /**
   * Whether the signature pad is open.
   */
  isOpenDraw: boolean;

  /**
   * Function to set the signature pad open state.
   */
  setIsOpenDraw: (isOpen: boolean) => void;
}

/**
 * SignaturePad Component
 * Allows users to draw their signature on a canvas.
 *
 * @param onSave - Callback to save the signature as a base64 string.
 * @param onClose - Callback to close the signature pad.
 */
export function SignaturePad({
  onSave,
  onClose,
  isOpenDraw,
  setIsOpenDraw,
}: SignaturePadProps) {
  const signatureCanvas = useRef<ReactSignatureCanvas>(null); // Reference to the signature canvas
  const [isEmpty, setIsEmpty] = useState(true); // State to track if the canvas is empty

  /**
   * Sets the canvas as not empty when drawing starts.
   */
  const handleDrawStart = () => {
    setIsEmpty(false);
  };

  /**
   * Clears the signature canvas.
   */
  const clear = () => {
    if (signatureCanvas.current) {
      signatureCanvas.current.clear();
    }
    setIsEmpty(true);
  };

  /**
   * Saves the current signature as a base64 string.
   */
  const save = () => {
    if (signatureCanvas.current) {
      const dataURL = signatureCanvas.current.toDataURL("image/png");
      onSave(dataURL);
    }
  };

  return (
    <Dialog open={isOpenDraw} onOpenChange={setIsOpenDraw}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Pen className="h-4 w-4" />
          Open Signature Pad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Sign Here</DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <div className="flex flex-col items-center space-y-4">
            {/* Canvas for drawing the signature */}
            <div className="relative border border-input rounded-md overflow-hidden">
              {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Sign here...
                </div>
              )}
              <SignatureCanvas
                ref={signatureCanvas}
                onBegin={handleDrawStart}
                canvasProps={{
                  className: "relative z-10",
                  width: 500,
                  height: 250,
                }}
              />
            </div>
            {/* Buttons for clearing, saving, or canceling */}
            <div className="flex space-x-2 flex-col sm:flex-row">
              <Button onClick={clear} variant="outline" className="gap-2">
                <RiResetLeftFill className="h-4 w-4" />
                Clear
              </Button>
              <Button onClick={save} className="gap-2">
                <FaSave className="w-4 h-4" />
                Save
              </Button>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
