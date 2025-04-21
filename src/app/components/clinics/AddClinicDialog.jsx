"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { useForm } from "react-hook-form";

const AddClinicDialog = ({ open }) => {
  const [activeTab, setActiveTab] = useState("general");
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

  // const clinicData = {
  //   name: values.clinicName,
  //   email: values.clinicEmail || null,
  //   phone: values.clinicPhone || null,
  //   streetAddress: values.streetAddress || null,
  //   city: values.city || null,
  //   state: values.state || null,
  //   zip: values.zipCode || null,
  //   primaryContact: values.primaryContact || null,
  //   billingContactName: values.billingContactName || null,
  //   billingEmail: values.billingEmail || null,
  //   billingPhone: values.billingPhone || null,
  //   billingAddress: values.billingAddress || null,
  //   billingCity: values.billingCity || null,
  //   billingState: values.billingState || null,
  //   billingZip: values.billingZip || null,
  //   paymentMethod: values.paymentMethod || null,
  //   subscriptionTier: values.subscriptionTier || null,
  //   subscriptionStatus: "active",
  // };
  const showSuccessDialog = false;
  const tempPassword = "12345678";
  const isSubmitting = false;
  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {showSuccessDialog ? (
          <>
            <DialogHeader>
              <DialogTitle>Clinic Created Successfully</DialogTitle>
              <DialogDescription>
                The clinic has been added to your organization. An account has
                been created for the clinic using the provided email.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h3 className="text-amber-800 font-medium mb-1">
                  Temporary Password
                </h3>
                <p className="text-amber-700 text-sm mb-2">
                  The clinic can log in with the following credentials:
                </p>
                <div className="flex items-center justify-between bg-white rounded p-2 border border-amber-200">
                  <code className="text-sm">{tempPassword}</code>
                  <Button variant="ghost" size="sm" className="h-8">
                    Copy
                  </Button>
                </div>
                <p className="text-amber-700 text-xs mt-2">
                  Please securely share this password with the clinic. They will
                  be able to change it after logging in.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCloseWithReset}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add New Clinic</DialogTitle>
              <DialogDescription>
                Add a new clinic to your organization. A coach will
                automatically be created using the primary contact information.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">General Info</TabsTrigger>
                    <TabsTrigger value="billing">Billing Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 mt-4">
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="clinicName"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="primaryContact"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right whitespace-nowrap">
                              Primary Contact{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Main contact person's name"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right whitespace-nowrap">
                              Street Address{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              City <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              State <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              ZIP Code <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clinicEmail"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Email <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clinicPhone"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Phone <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} type="tel" />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="billing" className="space-y-4 mt-4">
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="billingContactName"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Billing Contact
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingEmail"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Billing Email
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingPhone"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Billing Phone
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} type="tel" />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingAddress"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Billing Address
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingCity"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Billing City
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingState"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Billing State
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingZip"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Billing ZIP
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right whitespace-nowrap">
                              Payment Method
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <select
                                  {...field}
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-10"
                                >
                                  <option value="">
                                    Select Payment Method
                                  </option>
                                  <option value="Credit Card">
                                    Credit Card
                                  </option>
                                  <option value="Bank Transfer">
                                    Bank Transfer
                                  </option>
                                  <option value="PayPal">PayPal</option>
                                  <option value="Check">Check</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriptionTier"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right whitespace-nowrap">
                              Subscription Tier
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <select
                                  {...field}
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-10"
                                >
                                  <option value="">Select Subscription</option>
                                  <option value="Basic">Basic</option>
                                  <option value="Standard">Standard</option>
                                  <option value="Premium">Premium</option>
                                  <option value="Enterprise">Enterprise</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isSubmitting ? "Adding..." : "Add Clinic"}
                    </Button>
                  </DialogFooter>
                </Tabs>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddClinicDialog;
