import ClientListItem from "./ClientListItem";

const CoachClientList = () => {
  const coachClients = [
    {
      id: "aaa",
      name: "string",
      email: "string",
      phone: "13213123",
      status: "active",
      clinicId: "asdfasdf",
      clinicName: "sdf",
      clients: 2,
    },
    {
      id: "aasdfa",
      name: "stsdfring",
      email: "strsdfweing",
      phone: "1323242313123",
      status: "active",
      clinicId: "asdfasdsfdf",
      clinicName: "sdf23",
      clients: 22,
    },
    {
      id: "aawerwerwea",
      name: "strwerweing",
      email: "strwering",
      phone: "13213123233",
      status: "active",
      clinicId: "asdfsdfasdf",
      clinicName: "sfffffdf",
      clients: 2,
    },
  ];
  return (
    <div className="space-y-4">
      {coachClients.map((client) => (
        <ClientListItem key={client.id} client={client} />
      ))}
    </div>
  );
};

export default CoachClientList;
