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
import { useState } from "react";
const ProgramsPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showAddProgramDialog, setshowAddProgramDialog] = useState(false);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const programs = [
    {
      id: "1",
      name: "pro1",
      description: "first pro",
      duration: 5,
      type: "practice_naturals",
      checkInFrequency: "daily",
      clinicId: "asdf",
      clientCount: 3,
      supplements: [
        {
          id: "a",
          name: "a",
          frequency: "daily",
          description: "hello",
          dosage: "hi",
          timeofDay: "morning",
        },
        {
          id: "b",
          name: "b",
          frequency: "daily",
          description: "hello",
          dosage: "he",
          timeofDay: "morning",
        },
      ],
    },
    {
      id: "2",
      name: "pro2",
      description: "second pro",
      duration: 7,
      type: "chirothin",
      checkInFrequency: "daily",
      clinicId: "asddf",
      clientCount: 12,
      supplements: [
        {
          id: "a",
          name: "a",
          frequency: "daily",
          description: "hello",
          dosage: "hi",
          timeofDay: "morning",
        },
        {
          id: "b",
          name: "b",
          frequency: "daily",
          description: "hello",
          dosage: "he",
          timeofDay: "morning",
        },
      ],
    },
  ];
  const isLoading = false;
  const isError = false;
  const isSubmitting = false;
  const handleSubmitProgram = () => {};
  const handleCloseDialog = () => {};
  const handleAddProgram = () => {
    setshowAddProgramDialog(true);
  };
  const handleViewProgramDetails = (program) => {
    console.log("Selected program for details:", program);
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
