
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Separator } from '../ui/separator';

const TemplateDetailsDialog = ({ template, isOpen, onClose }) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{template.type}</DialogTitle>
          <DialogDescription>
            {template.type.replace('_', ' ')} program
          </DialogDescription>
        </DialogHeader>
      <div className="mt-4">
        <p>{template.type}</p>
        <Separator className="my-4" />
        <p>{template.description}</p>
      </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDetailsDialog;
