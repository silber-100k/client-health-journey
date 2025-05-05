"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const TemplateDialog = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [templateType, setTemplateType] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const handleSubmit = async () => {
    const data = {
      type: templateType,
      description: templateDescription,
    };
    console.log("server",data);
    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Template</DialogTitle>
          <DialogDescription>
            Create a new template for your clients. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label htmlFor="template-type">Template Type</Label>
          <Input id="template-type" value={templateType} onChange={(e) => setTemplateType(e.target.value)} />
          <Label htmlFor="template-description">Template Description</Label>
          <Textarea id="template-description" value={templateDescription} onChange={(e) => setTemplateDescription(e.target.value)} />
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
              "Create Template"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
