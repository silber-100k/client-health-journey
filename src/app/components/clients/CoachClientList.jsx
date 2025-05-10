import ClientListItem from "./ClientListItem";

const CoachClientList = ({clients}) => {
  return (
    <div className="space-y-4">
      {clients?.map((client) => (
        <ClientListItem key={client._id} client={client} />
      ))}
    </div>
  );
};

export default CoachClientList;
