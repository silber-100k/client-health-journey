'use client'

import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import SignupDemoNotice from "../auth/signup/SignupDemoNotice";
import { Card } from "../components/ui/card";
import ClinicSignupForm from "../auth/signup/ClinicSignupForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ClinicSignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data, additionalCoaches) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/clinic", {
        method: "POST",
        body: JSON.stringify({ ...data, additionalCoaches }),
      });
      if (!response.ok) {
        throw new Error("Failed to create clinic");
      }
      const result = await response.json();
      if (result.success) {
        toast.success("Clinic created successfully");
        router.push("/login");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create clinic");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-2">
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Button>
        </div>

        <Card className="w-full">
          <div className="px-6 pt-4">
            <SignupDemoNotice />
          </div>
          <ClinicSignupForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
        </Card>
      </div>
    </div>
  );
};

export default ClinicSignUpPage;
