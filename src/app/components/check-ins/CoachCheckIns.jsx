import React, { useState, useEffect } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

const CoachCheckIns = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachCheckIns = async () => {
      // if (!user?.id) return;

      setLoading(true);
      // First fetch all clients for this coach
      // Get check-ins for these clients
    };

    fetchCoachCheckIns();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (checkIns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No check-ins found. Your clients need to submit their check-ins.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Mood</TableHead>
            <TableHead>Energy</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checkIns.map((checkIn) => (
            <TableRow key={checkIn.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${checkIn.clientName}`}
                      alt={checkIn.clientName}
                    />
                    <AvatarFallback>
                      {checkIn.clientName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{checkIn.clientName}</div>
                </div>
              </TableCell>
              <TableCell>
                {new Date(checkIn.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {checkIn.weight ? `${checkIn.weight} lbs` : "Not recorded"}
              </TableCell>
              <TableCell>
                {checkIn.mood ? (
                  <Badge
                    className="bg-blue-100 text-blue-800"
                    variant="outline"
                  >
                    {checkIn.mood}/5
                  </Badge>
                ) : (
                  "Not recorded"
                )}
              </TableCell>
              <TableCell>
                {checkIn.energy ? (
                  <Badge
                    className="bg-green-100 text-green-800"
                    variant="outline"
                  >
                    {checkIn.energy}/5
                  </Badge>
                ) : (
                  "Not recorded"
                )}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {checkIn.notes || "No notes"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoachCheckIns;
