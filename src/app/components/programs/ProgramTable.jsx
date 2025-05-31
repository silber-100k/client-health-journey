import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Utensils,
  FileText,
  Calendar,
  ListCheck,
  Loader2,
  Users,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const ProgramTable = ({ programs, isLoading, isError, onSelectProgram }) => {
  const {user} = useAuth();
  const isAdmin = user?.role === "admin";
  const getProgramIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "nutrition":
      case "practice_naturals":
        return <Utensils className="h-5 w-5 text-primary-700" />;
      case "fitness":
        return <ListCheck className="h-5 w-5 text-primary-700" />;
      case "chirothin":
      case "keto":
        return <Calendar className="h-5 w-5 text-primary-700" />;
      default:
        return <FileText className="h-5 w-5 text-primary-700" />;
    }
  };
  console.log(programs);
  const formatDuration = (days) => {
    if (days === 30) return "30 days";
    if (days === 60) return "60 days";
    if (days % 7 === 0) {
      const weeks = days / 7;
      return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
    }
    return `${days} days`;
  };

  console.log("ProgramTable rendering with programs:", programs);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load programs. Please try again.
      </div>
    );
  }

  if (!programs || programs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No programs found. Click "Add Program" to create one.
      </div>
    );
  }
  console.log("table", programs);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program</TableHead>
            {isAdmin?(
              <TableHead>Clinic</TableHead>
            ):("")}
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>Clients</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program, index) => (
            <TableRow
              key={index}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectProgram(program)}
            >
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
                    {getProgramIcon(
                      program?.type ? program.type : program.template?.type
                    )}
                  </div>
                  <div className="font-medium">
                    {program.name
                      ? program.name
                      : `${program.template?.type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())} Program`}
                  </div>
                </div>
              </TableCell>
              {
                isAdmin?(
                  <TableCell>
                 {program.clinicEmail}
                  </TableCell>
                ):("")
              }
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {program.template? program.template.type : "custom"}
                </Badge>
              </TableCell>
              <TableCell>{formatDuration(program.duration)}</TableCell>
              <TableCell>
                {program.checkInFrequency === "daily" ? "Daily" : "Weekly"}
              </TableCell>
              <TableCell>
                {program.clientCount !== undefined ? program.clientCount : 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProgramTable;
