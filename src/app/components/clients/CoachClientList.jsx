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
    <div className="space-y-3 sm:space-y-4">
      {clients && clients?.length > 0 ? clients?.map((client) => (
        <ClientListItem key={client.id} client={client} handleViewProgram = {handleViewProgram}/>
      )) : (
        <div className="flex items-center justify-center h-full py-8">
          <p className="text-gray-500 text-sm">No clients found</p>
        </div>
      )}
       <Dialog open={isProgramDetailsOpen} onOpenChange={setIsProgramDetailsOpen}>
        <DialogContent className="w-full max-w-full sm:max-w-[600px] px-2 sm:px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {selectedClient?.program_title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2 text-xs sm:text-sm">
            <div><span className="font-bold text-gray-600">Description:</span> {selectedClient?.program_description}</div>
            <div><span className="font-bold text-gray-600">Duration:</span> {selectedClient?.program_duration}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachClientList;
