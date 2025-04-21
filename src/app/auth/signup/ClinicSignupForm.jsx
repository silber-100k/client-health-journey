"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Building } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import ClinicInformationTab from './ClinicInformationTab';
import CoachSetupTab from './CoachSetupTab';
import AccountSetupTab from './AccountSetupTab';
import { clinicSignupSchema, planOptions } from './types';

const ClinicSignupForm = ({ isSubmitting, onSubmit }) => {
  const [activeTab, setActiveTab] = React.useState('clinic');
  const [additionalCoaches, setAdditionalCoaches] = React.useState([]);
  const [createAccount, setCreateAccount] = React.useState(true);

  const form = useForm({
    resolver: zodResolver(clinicSignupSchema),
    defaultValues: {
      clinicName: '',
      clinicEmail: '',
      clinicPhone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      primaryContact: '',
      email: '',
      password: '',
      confirmPassword: '',
      hipaaAcknowledgment: false,
      legalAcknowledgment: false,
      selectedPlan: planOptions[1].id, // Default to Professional plan
      addOns: [],
    },
    mode: 'onChange'
  });

  const handleSubmit = async (values) => {
    await onSubmit(values, additionalCoaches);
  };

  const addCoach = () => {
    setAdditionalCoaches([...additionalCoaches, { name: '', email: '', phone: '' }]);
  };

  const removeCoach = (index) => {
    const updatedCoaches = [...additionalCoaches];
    updatedCoaches.splice(index, 1);
    setAdditionalCoaches(updatedCoaches);
  };

  const updateCoach = (index, field, value) => {
    const updatedCoaches = [...additionalCoaches];
    updatedCoaches[index][field] = value;
    setAdditionalCoaches(updatedCoaches);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center">
          <Building className="mr-2 h-6 w-6 text-primary" />
          <CardTitle>Clinic Signup</CardTitle>
        </div>
        <CardDescription>
          Register your clinic and create your account to get started
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clinic">Clinic Information</TabsTrigger>
                <TabsTrigger value="coaches">Coach Setup</TabsTrigger>
                <TabsTrigger value="account">Account & Plan</TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="space-y-4 mt-4">
              <TabsContent value="clinic">
                <ClinicInformationTab 
                  form={form} 
                  onNext={() => setActiveTab('coaches')} 
                />
              </TabsContent>

              <TabsContent value="coaches">
                <CoachSetupTab 
                  form={form}
                  additionalCoaches={additionalCoaches}
                  onAddCoach={addCoach}
                  onRemoveCoach={removeCoach}
                  onUpdateCoach={updateCoach}
                  onBack={() => setActiveTab('clinic')}
                  onNext={() => setActiveTab('account')}
                />
              </TabsContent>

              <TabsContent value="account">
                <AccountSetupTab 
                  form={form}
                  createAccount={createAccount}
                  onToggleCreateAccount={setCreateAccount}
                  onBack={() => setActiveTab('coaches')}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </form>
      </Form>
    </>
  );
};

export default ClinicSignupForm;
