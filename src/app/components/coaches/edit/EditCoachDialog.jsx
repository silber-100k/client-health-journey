import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { CoachForm } from "../../../components/coaches/CoachForm";

export const EditCoachDialog = ({}) => {
  const open = false;
  const clinicName = "d";
  const coach = true;
  return (
    <>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
            <DialogDescription>
              Update coach information for {clinicName}.
            </DialogDescription>
          </DialogHeader>

          {coach && <CoachForm submitButtonText="Save Changes" />}
        </DialogContent>
      </Dialog>
    </>
  );
};
