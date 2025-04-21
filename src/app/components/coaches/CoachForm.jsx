import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export const CoachForm = ({
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues = {
    name: "",
    email: "",
    phone: "",
  },
  submitButtonText = "Add Coach",
}) => {
  const form = useForm({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel htmlFor="name" className="text-right">
                  Name <span className="text-red-500">*</span>
                </FormLabel>
                <div className="col-span-3">
                  <FormControl>
                    <Input id="name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel htmlFor="email" className="text-right">
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <div className="col-span-3">
                  <FormControl>
                    <Input id="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel htmlFor="phone" className="text-right">
                  Phone
                </FormLabel>
                <div className="col-span-3">
                  <FormControl>
                    <Input id="phone" type="tel" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isSubmitting ? "Saving..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
