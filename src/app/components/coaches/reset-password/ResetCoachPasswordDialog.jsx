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
  setOpen,
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
        setOpen(false);
        toast.success("Password reset successfully");
      } else {
        throw new error(responseData.message);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Coach Password</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {errorMessage && (
            <div className="text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            The coach password will be reset to the default password.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleReset}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
