"use client";
import { useForm, FormProvider } from "react-hook-form";
import { DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Form } from "../../components/ui/form";
import ClientFormFields from "./ClientFormFields";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./AddClientSchema";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

const AddClientForm = ({ onCancel, fetchClients, clientLimit, clientCount }) => {
  const { user } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      programId: "",
      programCategory: "",
      startDate: new Date().toISOString().split("T")[0],
      notes: "",
      coachId: "",
      initialWeight: "",
      weightDate: new Date().toISOString().split("T")[0],
      goals: [],
    },
  });
  const [createError, setCreateError] = useState(false);
  const [programsError, setProgramError] = useState(false);
  const [coachesError, setCoachesError] = useState(false);
  const [isProgramsLoading, setProgramsLoading] = useState(false);
  const [isCoachesLoading, setCoachesLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const effectiveClinicId = user?.clinic._id;
  const isCoach = user?.role === "coach";
  const isClinicAdmin = user?.role === "clinic_admin";
  let apiRole = "";
  if (isClinicAdmin) {
    apiRole = "clinic";
  }
  if (isCoach) {
    apiRole = "coach";
  }

  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true);
      const response = await fetch("/api/clinic/program");
      const data = await response.json();
      setPrograms(data.programs);
      setProgramsLoading(false);
      setProgramError(false);
    } catch (error) {
      console.log(error);
      setProgramError(true);
      toast.error("Failed to fetch programs");
    }
  };

  const fetchCoaches = async () => {
    try {
      setCoachesLoading(true);
      const response = await fetch("/api/clinic/coach");
      const data = await response.json();
      setCoaches(data.coaches);
      setCoachesLoading(false);
      setCoachesError(false);
    } catch (error) {
      setCoachesError(true);
      console.error(error);
      toast.error("Failed to fetch coaches");
    }
  };

  useEffect(() => {
    fetchPrograms();
    if (isClinicAdmin) {
      fetchCoaches();
    }
  }, []);

  const onSubmit = async (data) => {
    if (isCoach) {
      data = { ...data, ["coachId"]: user._id };
    }
    if (isPending) {
      return;
    }
    if (clientLimit !== false && (clientLimit === 0 || clientLimit <= clientCount)) {
      toast.error("You have reached the maximum number of clients");
      return;
    }

    setIsPending(true);
    try {
      const response = await fetch(`/api/${apiRole}/client`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        onCancel();
        toast.success("client added successfully");
        fetchClients();
      } else {
        toast.error(responseData.message);
        throw new Error(responseData.message);
      }

      const resActivity = await fetch("/api/activity/addMembers", {
        method: "POST",
        body: JSON.stringify({
          type: "client_added",
          description: `New client added to ${user.name}`,
          clinicId: user.clinic._id,
        }),
      });
      const respond = await resActivity.json();
      if (respond.status) {
        toast.success("Activity added successfully");
      } else {
        throw new Error(respond.message);
      }
    } catch (error) {
      setCreateError(error);
      console.error(error);
      toast.error("Failed to add client");
    } finally {
      setIsPending(false);
    }
  };

  console.log("coaceh", coaches);
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

          {/* {!isCoachesLoading && coaches?.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No coaches found for your clinic. You should add coaches first
                from the Coaches page.
              </AlertDescription>
            </Alert>
          )} */}

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
            form={form}
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
