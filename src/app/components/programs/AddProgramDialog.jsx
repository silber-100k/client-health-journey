"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Skeleton } from "../ui/skeleton";

const AddProgramDialog = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [programType, setProgramType] = useState("nutrition");
  const [customName, setCustomName] = useState("");
  const [programDuration, setProgramDuration] = useState("");
  const [checkInFrequency, setCheckInFrequency] = useState("daily");
  const [programDescription, setProgramDescription] = useState("");
  const { user } = useAuth();
  const [Templates, setTemplates] = useState([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isTemplateError, setIsTemplateError] = useState(false);
  const [tempId, settempId] = useState(null);
  const [tempvalue, setvalue] = useState("");
  // Reset form when dialog opens/closes
  const fetchTemplates = async () => {
    try {
      setIsTemplateLoading(true);
      const response = await fetch("/api/admin/template");
      const data = await response.json();
      setTemplates(data.templates);
      setIsTemplateLoading(false);
      setIsTemplateError(false);
    } catch (error) {
      console.log(error);
      setIsTemplateError(true);
      toast.error("Failed to fetch templates");
    }
  };
  useEffect(() => {
    if (!isOpen) {
      setProgramType("");
      setCustomName("");
      setProgramDuration("");
      setCheckInFrequency("daily");
      setProgramDescription("");
      settempId(null);
    }
    fetchTemplates();
  }, [isOpen]);

  const getProgramName = () => {
    if (programType === "custom") {
      return customName;
    } else if (programType) {
      return `${programType
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())} Program`;
    }
  };

  const handlechange = (value) => {
    if (value == "custom") {
      setProgramType("custom");
    } else {
      settempId(value);
    }
    setvalue(value);
  };
  const handleSubmit = async () => {
    // Use the clinicId prop or fall back to the user's clinicId
    const effectiveClinicId = user?.clinic?._id || "";

    console.log("Submitting program with clinicId:", effectiveClinicId);
    const data = {
      name: getProgramName(),
      type: programType,
      duration: programDuration,
      checkInFrequency: checkInFrequency,
      description: programDescription,
      tempId: tempId,
      clinicId: effectiveClinicId,
    };
    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Program</DialogTitle>
          <DialogDescription>
            Create a new program for your clients. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Type" className="text-right">
              Type
            </Label>
            {isTemplateLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
              </div>
            ) : isTemplateError ? (
              <div className="text-center py-8 text-red-500">
                Failed to load Templates. Please try again.
              </div>
            ) : Templates && Templates.length > 0 ? (
              <Select value={tempvalue} onValueChange={handlechange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {Templates.map((template, index) => (
                    <SelectItem key={index} value={template._id}>
                      {template.type}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No Templates found. Click "Add Template" to create one.
              </div>
            )}
          </div>

          {programType === "custom" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="custom-name" className="text-right">
                Name
              </Label>
              <Input
                id="custom-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="col-span-3"
                placeholder="Enter custom program name"
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="program-duration" className="text-right">
              Duration
            </Label>
            <Select value={programDuration} onValueChange={setProgramDuration}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30-days">30 Days</SelectItem>
                <SelectItem value="60-days">60 Days</SelectItem>
                <SelectItem value="6-weeks">6 Weeks</SelectItem>
                <SelectItem value="8-weeks">8 Weeks</SelectItem>
                <SelectItem value="12-weeks">12 Weeks</SelectItem>
                <SelectItem value="16-weeks">16 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="check-in-frequency" className="text-right">
              Check-in
            </Label>
            <Select
              value={checkInFrequency}
              onValueChange={(value) => setCheckInFrequency(value)}
              className="!border !border-black"
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select check-in frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="program-description"
              className="text-right align-top pt-2"
            >
              Description
            </Label>
            <Textarea
              id="program-description"
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              className="col-span-3"
              rows={4}
              placeholder="Describe the program and its goals"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Program"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProgramDialog;
