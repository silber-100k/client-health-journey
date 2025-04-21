import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

export const ResetCoachPasswordDialog = () => {
  const open = false;
  const coach = {
    id: "asdf",
    name: "asdfasdf",
    email: "dfadsf",
    clients: 5,
  };
  const errorMessage = "";
  const isSubmitting = false;
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Coach Password</DialogTitle>
          <DialogDescription>
            {coach?.email
              ? `Send a password reset link to ${coach.name} at ${coach.email}`
              : "Send a password reset link to the coach email address"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {errorMessage && (
            <div className="text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            This will send an email with a secure link that will allow the coach
            to reset their password.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
