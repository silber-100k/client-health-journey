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
} from "../../../components/ui/select";
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
export const AddCoachDialog = ({ open }) => {
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };

  const clinics = [
    { id: "1", name: "aaa" },
    { id: "2", name: "bbb" },
  ];
  const [selectedClinicId, setSelectedClinicId] = useState("");

  const clinicsLoading = false;

  const isSystemAdmin = user?.role === "admin" || user?.role === "super_admin";

  const handleClinicChange = (clinicId) => {
    setSelectedClinicId(clinicId);
  };
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coach</DialogTitle>
          <DialogDescription>
            Add a new coach to ooo. They will receive an email invitation to set
            up their account.
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
                    <SelectItem key={clinic.id} value={clinic.id}>
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
        <CoachForm />
      </DialogContent>
    </Dialog>
  );
};
