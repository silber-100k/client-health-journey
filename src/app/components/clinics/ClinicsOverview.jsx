import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Building } from "lucide-react";
import ClinicsTable from "../../components/clinics/ClinicsTable";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

const ClinicsOverview = ({
  clinics,
  onEdit,
  onDelete,
  onClinicSelect,
  getStatusColor,
  onAddClinic,
  fetchClinics,
  isLoading,
}) => {
  const hasActions = onEdit||onDelete;
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage clinics, their coaches, and billing information.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center"
            title="Refresh clinics"
            onClick={fetchClinics}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={onAddClinic}
            disabled={isLoading}
          >
            <Building size={18} />
            <span>Add Clinic</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clinics</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ClinicsTable
              clinics={clinics}
              onClinicSelect={onClinicSelect}
              getStatusColor={getStatusColor}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicsOverview;
