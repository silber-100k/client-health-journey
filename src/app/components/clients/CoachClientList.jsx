import ClientListItem from "./ClientListItem";

const CoachClientList = ({clients}) => {
  return (
    <div className="space-y-4">
      {clients && clients?.length > 0 ? clients?.map((client) => (
        <ClientListItem key={client._id} client={client} />
      )) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No clients found</p>
        </div>
      )}
    </div>
  );
};

export default CoachClientList;
