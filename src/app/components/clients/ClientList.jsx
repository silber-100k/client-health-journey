import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
const ClientList = ({ clinicId }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Coach</TableHead>
          <TableHead>Program</TableHead>
          <TableHead>Last Check-in</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>
              {client.coach
                ? client.coach.name
                : client.coachId
                ? "Assigned"
                : "Unassigned"}
            </TableCell>
            <TableCell>{client.programId ? "Assigned" : "None"}</TableCell>
            <TableCell>
              {client.lastCheckIn ? (
                new Date(client.lastCheckIn).toLocaleDateString()
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800"
                >
                  No check-ins
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientList;
