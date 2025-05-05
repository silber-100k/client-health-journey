import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  description: z.string(),
});

export function EditTemplateDialogue({
  open,
  setOpen,
  tempId,
  fetchTemplates,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  useEffect(() => {
    const fetchTempData = async () => {
      if (open && tempId) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/admin/template/${tempId}`);
          const data = await response.json();
          console.log("data", data);
          if (data.status) {
            form.reset({
              description: data.template.description,
            });
            setErrorMessage(null);
          } else {
            setErrorMessage(data.message || "Failed to load template data");
          }
        } catch (error) {
          setErrorMessage("Failed to load user data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTempData();
  }, [open, tempId, form]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/template/${tempId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      if (result.status) {
        setErrorMessage(null);
        setOpen(false);
        await fetchTemplates();
        toast("Template updated successfully");
        await onEdit();
      } else {
        setErrorMessage(result.message || "Failed to update template");
      }
    } catch (error) {
      setErrorMessage("Failed to update template");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update the details for this Template Data.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="py-6 text-center">Loading Template Data...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} className="overflow-hi"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
