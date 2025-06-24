const ClientListItem = ({ client, handleViewProgram }) => {
  return (
    <div
      key={client.id}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-md hover:bg-gray-50 cursor-pointer gap-2 sm:gap-0"
      onClick={()=>(handleViewProgram(client))}
    >
      <div>
        <h3 className="font-medium text-base sm:text-lg">{client.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500">{client.email}</p>
      </div>
      <div className="text-xs sm:text-sm text-gray-500">
        Last check-in:{" "}
        {client.lastCheckIn
          ? new Date(client.lastCheckIn).toLocaleDateString()
          : "Never"}
      </div>
    </div>
  );
};

export default ClientListItem;
