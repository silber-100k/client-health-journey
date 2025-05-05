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
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
export const DeleteCoachDialog = ({
  open,
  setOpen,
  selectedCoach,
  fetchCoaches,
}) => {
  const coach = selectedCoach;
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    console.log("selectedCoach");
    if (!coach) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/clinic/coach/${selectedCoach._id}`, {
        method: "DELETE",
        body: JSON.stringify(coach),
      });
      const responseData = await response.json();
      if (responseData.status) {
        setOpen(false);
        toast.success("Coach deleted successfully");
      } else {
        throw new error(responseData.message);
      }
    } catch (err) {
      console.error("Error deleting coach:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to delete coach");
    } finally {
      await fetchCoaches();
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Coach</DialogTitle>
          <DialogDescription>
            {coach
              ? `Are you sure you want to delete ${coach.name}?`
              : "Delete this coach?"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="text-sm text-destructive">{error}</div>
          </div>
        )}

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the coach
            and remove any associated data.
          </p>

          {coach && coach.clients > 0 && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Warning:</strong> This coach has {coach.clients} active{" "}
                {coach.clients === 1 ? "client" : "clients"}. You will need to
                reassign them to another coach.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
