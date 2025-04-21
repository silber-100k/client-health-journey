import React, { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "../../components/ui/form";
import HipaaNotice from "./HipaaNotice";
import PlanOption from "./PlanOption";
import AddOnOptions from "./AddOnOptions";
import AccountCreationFields from "./AccountCreationFields";
import { planOptions, addOnOptions } from "./types";

const AccountSetupTab = ({
  form,
  createAccount,
  onToggleCreateAccount,
  onBack,
  isSubmitting,
}) => {
  useEffect(() => {
    if (createAccount && form.getValues("email") === "") {
      const clinicEmail = form.getValues("clinicEmail");
      form.setValue("email", clinicEmail);
    }
  }, [createAccount, form]);

  const selectedPlan = form.watch("selectedPlan");
  const addOns = form.watch("addOns") || [];

  const availableAddOns = addOnOptions.filter((addon) =>
    addon.availableFor.includes(selectedPlan)
  );

  const handleAddOnToggle = (addOnId, checked) => {
    const currentAddOns = form.getValues("addOns") || [];
    let updatedAddOns = [...currentAddOns];

    if (checked) {
      updatedAddOns.push(addOnId);
    } else {
      updatedAddOns = updatedAddOns.filter((id) => id !== addOnId);
    }

    form.setValue("addOns", updatedAddOns);
  };

  const handlePlanSelect = (planId) => {
    console.log("Selecting plan:", planId);

    form.setValue("selectedPlan", planId, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    const currentAddOns = form.getValues("addOns") || [];
    const validAddOns = currentAddOns.filter((addOnId) => {
      const addOn = addOnOptions.find((a) => a.id === addOnId);
      return addOn && addOn.availableFor.includes(planId);
    });

    if (currentAddOns.length !== validAddOns.length) {
      form.setValue("addOns", validAddOns);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Checkbox
          id="create-account"
          checked={createAccount}
          onCheckedChange={(checked) => onToggleCreateAccount(checked === true)}
          className="mr-2"
        />
        <label htmlFor="create-account" className="text-sm font-medium">
          Create an account for clinic management
        </label>
      </div>

      <HipaaNotice />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select a Plan</h3>
        <FormField
          control={form.control}
          name="selectedPlan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <div className="space-y-3">
                  {planOptions.map((plan) => (
                    <PlanOption
                      key={plan.id}
                      id={plan.id}
                      name={plan.name}
                      description={plan.description}
                      price={plan.price}
                      features={plan.features}
                      selected={field.value === plan.id}
                      onSelect={() => {
                        field.onChange(plan.id);
                        handlePlanSelect(plan.id);
                      }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AddOnOptions
        addOns={addOns}
        availableAddOns={availableAddOns}
        onToggleAddOn={handleAddOnToggle}
      />

      <AccountCreationFields form={form} show={createAccount} />

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Clinic..." : "Complete Signup"}
        </Button>
      </div>
    </div>
  );
};

export default AccountSetupTab;
