"use client";
import { Editor } from "primereact/editor";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { UserPlus, AlertCircle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
const UploadVideo = ({ setTrigger }) => {
  const { user } = useAuth();
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, submittedData] = useState({
    title: "",
    role: "",
    type: "Video",
    content: "",
  });
  const [texts, setAlltexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddlclientdialogue = () => {
    onOpenChange(true);
  };
  const isAdmin = user?.role === "admin";
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/resource/video`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        onOpenChange(false);
        setTrigger((prev) => !prev);
        toast.success("add a resource successfully");
        setIsSubmitting(false);
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Button onClick={handleAddlclientdialogue} className="mb-[20px]">
        <UserPlus className="mr-2 h-4 w-4" />
        Add video
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1000px] max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New document</DialogTitle>
            <DialogDescription>Create a new video.</DialogDescription>
          </DialogHeader>
          <Input
            name="title"
            placeholder="Name"
            onChange={(e) =>
              submittedData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <div>
            <Label htmlFor="role" className="mb-[10px]">
              To show
            </Label>
            <Select
              name="role"
              value={data.role}
              onValueChange={(e) =>
                submittedData((prev) => ({ ...prev, ["role"]: e }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the role to show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category" className="mb-[10px]">
              URL
            </Label>
            <Input
              name="content"
              placeholder="content"
              onChange={(e) =>
                submittedData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex justify-self-end">
            <Button
              onClick={handleSubmit}
              className="mr-[10px]"
              disabled={isSubmitting}
            >
              Submit{" "}
            </Button>
            <Button onClick={() => onOpenChange(false)}>Cancel </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default UploadVideo;
