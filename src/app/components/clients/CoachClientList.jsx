"use client"
import { useState } from "react";
import ClientListItem from "./ClientListItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

const CoachClientList = ({clients}) => {
  const [isProgramDetailsOpen, setIsProgramDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const handleViewProgram = (client) => {
    setSelectedClient(client);
    setIsProgramDetailsOpen(true);
  };

  console.log(isProgramDetailsOpen)
  return (
    <div className="space-y-4">
      {clients && clients?.length > 0 ? clients?.map((client) => (
        <ClientListItem key={client.id} client={client} handleViewProgram = {handleViewProgram}/>
      )) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No clients found</p>
        </div>
      )}
       <Dialog open={isProgramDetailsOpen} onOpenChange={setIsProgramDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedClient?.program_title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <div><span className="font-bold text-gray-600">Description:</span> {selectedClient?.program_description}</div>
            <div><span className="font-bold text-gray-600">Duration:</span> {selectedClient?.program_duration}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachClientList;
