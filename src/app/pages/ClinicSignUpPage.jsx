'use client'

import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import SignupDemoNotice from "../auth/signup/SignupDemoNotice";
import { Card } from "../components/ui/card";
import ClinicSignupForm from "../auth/signup/ClinicSignupForm";
import { useRouter } from "next/navigation";

const ClinicSignUpPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
<<<<<<< Updated upstream
          <Button variant="ghost" className="mr-2" onClick={() => router.push("/")}>
=======
          <Button
            variant="ghost"
            className="mr-2"
          >
>>>>>>> Stashed changes
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Button>
        </div>

        <Card className="w-full">
          <div className="px-6 pt-4">
            <SignupDemoNotice />
          </div>
          <ClinicSignupForm/>
        </Card>
      </div>
    </div>
  );
};

export default ClinicSignUpPage;
