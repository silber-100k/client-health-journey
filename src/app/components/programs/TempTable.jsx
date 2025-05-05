import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
const TempTable = ({
  Templates,
  isTemplateLoading,
  isTemplateError,
  onSelectTemplate,
  setSelectedTemplate,
  onEdit,
  onDelete,
}) => {
  if (isTemplateLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isTemplateError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load Templates. Please try again.
      </div>
    );
  }

  if (!Templates || Templates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No Templates found. Click "Add Template" to create one.
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden w-full">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Template Name</TableHead>
            <TableHead className="w-[60%]">Description</TableHead>
            <TableHead className="min-w-[20%]">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Templates.map((template, index) => (
            <TableRow
              key={index}
              className="cursor-pointer hover:bg-gray-50 max-w-full"
            >
              <TableCell
                className="w-[20%] truncate"
                onClick={() => onSelectTemplate(template)}
              >
                {template.type}
              </TableCell>
              <TableCell
                className="w-[70%] truncate"
                onClick={() => onSelectTemplate(template)}
              >
                {template.description}
              </TableCell>
              <TableCell
                onClick={() => setSelectedTemplate(template)}
                className="min-w-[20%]"
              >
                {" "}
                <Button className="mr-[10px]" onClick={() => onEdit(true)}>
                  Edit
                </Button>
                <Button onClick={onDelete}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TempTable;
