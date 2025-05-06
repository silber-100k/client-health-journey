"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

const SettingsPage = () => {
  const [profileForm, setProfileForm] = useState({
    coachName: "",
    email: "",
    phone: "",
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    clientCheck: true,
    clientMessage: true,
    clientUpdates: true,
  });

  const { user } = useAuth();

  useEffect(() => {
    setProfileForm({
      coachName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "", // Safe to use now that we've added it to the UserData type
    });
  }, [user]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // toast({
    //   title: "Profile Updated",
    //   description: "Your profile information has been saved.",
    // });
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!securityForm.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (!securityForm.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    try {
      const response = await fetch("/api/user/updatePassword", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Password updated successfully");
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the password");
    }
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coachName">coach Name</Label>
                  <Input
                    id="coachName"
                    value={profileForm.coachName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        coachName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                  />
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications{" "}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Client Check-In Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive notifications when clients submit check-ins
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.clientCheck}
                  onCheckedChange={() =>
                    handleNotificationChange("clientCheck")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Client Messages</p>
                  <p className="text-sm text-gray-500">
                    Receive notifications when clients send messages
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.clientMessage}
                  onCheckedChange={() =>
                    handleNotificationChange("clientMessage")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Client Progress Updates</p>
                  <p className="text-sm text-gray-500">
                    Receive weekly summaries of client progress
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.clientUpdates}
                  onCheckedChange={() =>
                    handleNotificationChange("clientUpdates")
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
