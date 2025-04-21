"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  UserPlus,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AddAdminUserDialog } from "../../components/admin/AddAdminUserDialog";
import { EditAdminUserDialog } from "../../components/admin/EditAdminUserDialog";
import { Badge } from "../../components/ui/badge";

const AdminUsersPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(undefined);
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };
  const isSuperAdmin = user?.role === "super_admin";
  const isError = false;
  const isLoading = false;
  const isFetching = false;
  const adminUsers = [
    {
      id: "1",
      full_name: "aimn se",
      email: "ste@gmail.com",
      role: "admin",
      is_active: true,
    },
    {
      id: "2",
      full_name: "aimn sde",
      email: "se@gmail.com",
      role: "admin",
      is_active: true,
    },
  ];
  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={isFetching}
            className="flex items-center justify-center"
            title="Refresh list"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          </Button>
          <Button className="flex items-center gap-2" onClick={handleAdd}>
            <UserPlus size={16} />
            <span>Add Admin User</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Admin Users</CardTitle>
          <CardDescription>
            Add, edit, or remove users with administrative access to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Admin users have full access to all features and data in the
              system. Add new admin users carefully.
            </AlertDescription>
          </Alert>

          {isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                There was an error loading admin users. Please try refreshing
                the page.
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading admin users...
                  </TableCell>
                </TableRow>
              ) : adminUsers?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No admin users found. Add an admin to get started.
                  </TableCell>
                </TableRow>
              ) : (
                adminUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "super_admin" ? "default" : "outline"
                        }
                      >
                        {user.role === "super_admin" ? "Super Admin" : "Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_active ? "success" : "destructive"}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {isSuperAdmin && user.role !== "super_admin" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600"
                          >
                            <ShieldCheck size={14} className="mr-1" /> Make
                            Super
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEdit}
                        >
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddAdminUserDialog open={isAddDialogOpen} isSuperAdmin={isSuperAdmin} />

      <EditAdminUserDialog
        open={isEditDialogOpen}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
};

export default AdminUsersPage;
