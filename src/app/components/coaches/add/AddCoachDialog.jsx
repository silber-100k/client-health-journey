"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { CoachForm } from "../../../components/coaches/CoachForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../../components/ui/form";
import { useForm, FormProvider } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";

export const AddCoachDialog = ({ open, setOpen, fetchCoaches }) => {
  const { user } = useAuth();
  const clinics = [
    { _id: "1", name: "aaa" },
    { _id: "2", name: "bbb" },
  ];

  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clinicsLoading = false;

  const isSystemAdmin = user?.role === "admin" || user?.role === "super_admin";

  const handleClinicChange = (clinicId) => {
    setSelectedClinicId(clinicId);
  };
  const handleSubmit = async (data) => {
    console.log("data", data);
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/clinic/coach", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.status) {
        await fetchCoaches();
        setOpen(false);
        toast.success("Coach added successfully");
      } else {
        throw new Error(responseData.message);
      }

      const resActivity = await fetch("/api/activity/addCoach", {
        method: "POST",
        body: JSON.stringify({
          type: "coach_added",
          description: `New coach added to ${user.name}`,
          clinicId: user.clinic._id,
        }),
      });
      const respond = await resActivity.json();
      if (respond.success) {
        toast.success("Activity added successfully");
      } else {
        throw new Error(respond.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coach</DialogTitle>
          <DialogDescription>
            Add a new coach to {user?.clinic?.name}. They will receive an email
            invitation to set up their account.
          </DialogDescription>
        </DialogHeader>

        {isSystemAdmin && (
          <div className="mb-4 w-full">
            <div className="text-[14px] text-[#020817] mb-[4px]">
              Select Clinic
            </div>
            <Select
              value={selectedClinicId}
              onValueChange={handleClinicChange}
              disabled={clinicsLoading || clinics.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a clinic" />
              </SelectTrigger>
              <SelectContent>
                {clinicsLoading ? (
                  <SelectItem value="loading" disabled>
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading clinics...
                    </span>
                  </SelectItem>
                ) : clinics.length > 0 ? (
                  clinics.map((clinic) => (
                    <SelectItem key={clinic._id} value={clinic._id}>
                      {clinic.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-clinics" disabled>
                    No clinics available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <div className="text-[14px] text-[#64748b] mt-[4px]">
              Select the clinic this coach will be assigned to
            </div>
            {!selectedClinicId && (
              <div className="text-[14px] text-[#64748b]">
                Please select a clinic
              </div>
            )}
          </div>
        )}
        <CoachForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
