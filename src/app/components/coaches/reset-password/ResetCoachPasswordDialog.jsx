"use client";
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
import { toast } from "sonner";
import { useState } from "react";
export const ResetCoachPasswordDialog = ({
  open,
  selectedCoach,
  onchange,
  fetchCoaches,
}) => {
  const coach = selectedCoach;
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");

  const handleReset = async () => {
    if (!coach) return;

    setisSubmitting(true);
    seterrorMessage(null);

    try {
      const response = await fetch(`/api/clinic/coach/${selectedCoach._id}`, {
        method: "PUT",
      });
      const responseData = await response.json();
      if (responseData.status) {
        onchange(false);
        toast.success("Password reseted successfully");
      } else {
        throw new error(responseData.message);
      }
    } catch (err) {
      console.error("Error deleting coach:", err);
      seterrorMessage(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to reset password");
    } finally {
      await fetchCoaches();
      setisSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onchange}>
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
          <Button variant="outline" onClick={() => onchange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReset}>
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
