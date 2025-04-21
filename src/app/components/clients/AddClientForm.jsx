import { useForm, FormProvider } from "react-hook-form";
import { DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Form } from "../../components/ui/form";
import ClientFormFields from "./ClientFormFields";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

const AddClientForm = ({ onCancel }) => {
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };
  const form = useForm({
    defaultValues: {
      clinicName: "",
      clinicEmail: "",
      clinicPhone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      primaryContact: "",
      billingContactName: "",
      billingEmail: "",
      billingPhone: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZip: "",
      paymentMethod: "",
      subscriptionTier: "",
    },
  });
  const createError = false;
  const programsError = false;
  const coachesError = false;
  const isProgramsLoading = false;
  const isCoachesLoading = false;
  const isPending = false;

  const programs = [];
  const coaches = [];

  const effectiveClinicId = true;

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {createError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error creating client</AlertTitle>
              <AlertDescription>
                {createError instanceof Error
                  ? createError.message
                  : "An unknown error occurred"}
              </AlertDescription>
            </Alert>
          )}

          {!effectiveClinicId && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing clinic information</AlertTitle>
              <AlertDescription>
                No clinic ID available. Please try logging out and back in.
              </AlertDescription>
            </Alert>
          )}

          {programsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load programs. {programsError.message}
              </AlertDescription>
            </Alert>
          )}

          {coachesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load coaches. {coachesError.message}
              </AlertDescription>
            </Alert>
          )}

          {!isProgramsLoading && programs.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No program templates available. The System Admin needs to create
                program templates.
              </AlertDescription>
            </Alert>
          )}

          {!isCoachesLoading && coaches.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No coaches found for your clinic. You should add coaches first
                from the Coaches page.
              </AlertDescription>
            </Alert>
          )}

          {!isProgramsLoading && programs.length > 0 && (
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Program Templates Available</AlertTitle>
              <AlertDescription>
                {programs.length} program template
                {programs.length > 1 ? "s are" : " is"} available for
                assignment.
                {programs.some((p) => p.isGlobal) && (
                  <span className="block mt-1 text-xs text-blue-600">
                    Some templates are system-wide and available to all clinics.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <ClientFormFields
            programs={programs}
            coaches={coaches}
            isProgramsLoading={isProgramsLoading}
            isCoachesLoading={isCoachesLoading}
          />

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormProvider>
  );
};

export default AddClientForm;
