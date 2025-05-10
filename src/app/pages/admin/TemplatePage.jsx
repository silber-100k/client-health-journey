"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TemplateDialog from "../../components/programs/TemplateDialog";
import TempTable from "../../components/programs/TempTable";
import TemplateDetailsDialog from "../../components/programs/TemplateDetailsDialog";
import { EditTemplateDialogue } from "@/app/components/programs/EditTemplateDialogue";

const ProgramsPage = () => {
  const [Templates, setTemplates] = useState([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isTemplateError, setIsTemplateError] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [isSubmittingTemplate, setIsSubmittingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [showEditDialogue, setEditDialogue] = useState(false);

  const fetchTemplates = async () => {
    try {
      setIsTemplateLoading(true);
      const response = await fetch("/api/admin/template");
      const data = await response.json();
      setTemplates(data.templates);
      setIsTemplateLoading(false);
      setIsTemplateError(false);
    } catch (error) {
      console.log(error);
      setIsTemplateError(true);
      toast.error("Failed to fetch templates");
    }
  };
  useEffect(() => {
    fetchTemplates();
  }, []);

  console.log("selected", selectedTemplate);
  const handleSubmitTemplate = async (data) => {
    console.log(data);
    setIsSubmittingTemplate(true);
    try {
      const response = await fetch("/api/admin/template", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        await fetchTemplates();
        setShowTemplateDialog(false);
        toast.success("Template added successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add template");
    } finally {
      setIsSubmittingTemplate(false);
    }
  };
  const handleViewTemplateDetails = (template) => {
    console.log("Selected template for details:", template);
    setSelectedTemplate(template);
    setShowTemplateDetails(true);
  };

  const handleDelete = async (data) => {
    try {
      const response = await fetch(`/api/admin/template/${data}`, {
        method: "DELETE",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        await fetchTemplates();
        toast.success("Template deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete template");
    }
  };
  return (
    <>
      <div>
        {/* Template Dialog */}
        <TemplateDialog
          isOpen={showTemplateDialog}
          onClose={() => setShowTemplateDialog(false)}
          onSubmit={handleSubmitTemplate}
          isSubmitting={isSubmittingTemplate}
        />
        <EditTemplateDialogue
          open={showEditDialogue}
          setOpen={setEditDialogue}
          tempId={selectedTemplate?._id}
          fetchTemplates={fetchTemplates}
        />

        {/* Template Details Dialog */}
        <TemplateDetailsDialog
          template={selectedTemplate}
          isOpen={showTemplateDetails}
          onClose={() => setShowTemplateDetails(false)}
        />
      </div>
      <div className="mt-[40px] flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div></div>
        <Button onClick={() => setShowTemplateDialog(true)}>
          <PlusCircle size={18} />
          <span>Add Template</span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {isTemplateLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isTemplateError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load Templates. Please try again.
            </div>
          ) : Templates && Templates.length > 0 ? (
            <TempTable
              Templates={Templates}
              isTemplateLoading={false}
              isTemplateError={false}
              onSelectTemplate={handleViewTemplateDetails}
              setSelectedTemplate={setSelectedTemplate}
              onEdit={setEditDialogue}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No Templates found. Click "Add Template" to create one.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ProgramsPage;
