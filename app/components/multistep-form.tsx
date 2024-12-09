"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import ItemForm, { Item } from "./item-form";
import { useToast } from "@/hooks/use-toast";
import SignatureForm from "./signature-form";
import { SkeletonLoader } from "./skeleton-loader";

/**
 * Interface representing the overall form data structure.
 * Note that step4 now holds an array of items.
 */
interface FormData {
  step1: {
    name: string;
    email: string;
  };
  step2: {
    age: string;
    gender: string;
  };
  step3: {
    bio: string;
  };
  step4: {
    items: Item[];
  };
  step5: {
    signatureImage: string | null;
  };
}

/**
 * Initial state of the form data, representing empty/default values.
 */
const initialFormData: FormData = {
  step1: { name: "", email: "" },
  step2: { age: "", gender: "" },
  step3: { bio: "" },
  step4: {
    items: [],
  },
  step5: {
    signatureImage: null,
  },
};

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load saved data from localStorage (if any) when component mounts.
  useEffect(() => {
    const savedData = localStorage.getItem("multistepFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    setIsLoading(false);
  }, []);

  // Persist the form data to localStorage on every update.
  useEffect(() => {
    localStorage.setItem("multistepFormData", JSON.stringify(formData));
  }, [formData]);

  /**
   * Updates the specified field within a given step (except step4) with a new value.
   *
   * @param step - The step of the form being updated (e.g., 'step1', 'step2', 'step3').
   * @param field - The specific field within that step to update.
   * @param value - The new value to set for that field.
   */
  const handleInputChange = (
    step: keyof Omit<FormData, "step4">,
    field: string,
    value: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [field]: value,
      },
    }));
  };

  /**
   * Updates the items array in step4.
   *
   * @param items - The new array of items.
   */
  const updateItems = (items: Item[]) => {
    setFormData((prevData) => ({
      ...prevData,
      step4: {
        ...prevData.step4,
        items: items,
      },
    }));
  };

  /**
   * Updates the signatureImage field in step5.
   *
   * @param signatureImage - The new signature image.
   */
  const updateSignature = (signatureImage: string | null) => {
    setFormData((prevData) => ({
      ...prevData,
      step5: {
        ...prevData.step5,
        signatureImage: signatureImage,
      },
    }));
  };

  /**
   * Navigates to the next step, ensuring we do not exceed the maximum step (which is 4).
   */
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));

  /**
   * Navigates to the previous step, ensuring we do not go below step 1.
   */
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  /**
   * Sends form data to the server via a POST request to /api/submit-form.
   * Upon successful submission, clears the localStorage and logs a success message.
   */
  const submitForm = async () => {
    const response = await fetch("/api/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      localStorage.removeItem("multistepFormData");
      toast({
        title: "Form submitted successfully",
        description: "Thank you for submitting the form",
      });
    } else {
      toast({
        title: "Form error",
        description: "Error submitting form",
        variant: "destructive",
      });
    }
  };

  /**
   * Renders the UI for the current step based on 'currentStep' state.
   */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.step1.name}
                onChange={(e) =>
                  handleInputChange("step1", "name", e.target.value)
                }
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.step1.email}
                onChange={(e) =>
                  handleInputChange("step1", "email", e.target.value)
                }
                placeholder="Enter your email"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.step2.age}
                onChange={(e) =>
                  handleInputChange("step2", "age", e.target.value)
                }
                placeholder="Enter your age"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.step2.gender}
                onValueChange={(value) =>
                  handleInputChange("step2", "gender", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.step3.bio}
                onChange={(e) =>
                  handleInputChange("step3", "bio", e.target.value)
                }
                placeholder="Tell us about yourself"
                rows={5}
              />
            </div>
          </div>
        );
      case 4:
        // In step 4, we show the ItemForm and pass in the current items and the update function
        return (
          <ItemForm items={formData.step4.items} onItemsChange={updateItems} />
        );
      case 5:
        // In step 5, we show the SignatureForm
        return (
          <>
            <SignatureForm
              signature={formData.step5.signatureImage}
              onSignatureChange={updateSignature}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <section className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Step {currentStep} of 5</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
      <div className="fixed bottom-0 flex justify-between w-full p-4 bg-gray-200">
        <Button onClick={prevStep} disabled={currentStep === 1}>
          Previous
        </Button>
        {currentStep < 5 && (
          <Button onClick={nextStep} disabled={currentStep === 5}>
            Next
          </Button>
        )}
        {currentStep === 5 && <Button onClick={submitForm}>Submit</Button>}
      </div>
    </section>
  );
}
