"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import ProgramTable from "../../components/programs/ProgramTable";
import AddProgramDialog from "../../components/programs/AddProgramDialog";
import ProgramDetailsDialog from "../../components/programs/ProgramDetailsDialog";
import { Skeleton } from "../../components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProgramsPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showAddProgramDialog, setshowAddProgramDialog] = useState(false);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/program");
      const data = await response.json();
      setPrograms(data.programs);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
      toast.error("Failed to fetch programs");
    }
  };
  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmitProgram = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/clinic/program", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        await fetchPrograms();
        setshowAddProgramDialog(false);
        toast.success("Program added successfully");
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add program");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseDialog = () => {
    setshowAddProgramDialog(false);
  };
  const handleAddProgram = () => {
    setshowAddProgramDialog(true);
  };
  const handleViewProgramDetails = (program) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        <Button onClick={handleAddProgram} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Add Program</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load programs. Please try again.
            </div>
          ) : programs && programs.length > 0 ? (
            <ProgramTable
              programs={programs}
              isLoading={false}
              isError={false}
              onSelectProgram={handleViewProgramDetails}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No programs found. Click "Add Program" to create one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Program Dialog */}
      <AddProgramDialog
        isOpen={showAddProgramDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitProgram}
        isSubmitting={isSubmitting}
      />

      {/* Program Details Dialog */}
      <ProgramDetailsDialog
        program={selectedProgram}
        isOpen={showProgramDetails}
        onClose={() => setShowProgramDetails(false)}
      />
    </div>
  );
};

export default ProgramsPage;
