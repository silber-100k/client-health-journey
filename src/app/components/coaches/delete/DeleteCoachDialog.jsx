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

export const DeleteCoachDialog = ({ open }) => {
  const coach = {
    id: "asdf",
    name: "asdfasdf",
    clients: 5,
  };
  const error = false;
  const isDeleting = false;
  return (
    <Dialog open={open}>
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
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">
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
