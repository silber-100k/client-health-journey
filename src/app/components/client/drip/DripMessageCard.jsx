import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { MessageCircleHeart, Star } from "lucide-react";

const DripMessageCard = ({ message }) => {
  return (
    <Card className="mb-6 border-l-4 border-l-primary w-full max-w-full">
      <CardHeader className="pb-2 px-2 sm:px-4">
        <CardTitle className="flex items-center text-base sm:text-lg gap-2">
          <MessageCircleHeart size={20} className="text-primary" />
          <span>Today's Motivation</span>
          {!message.is_read && (
            <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <h3 className="font-medium text-base sm:text-lg mb-2">{message.subject}</h3>
        <p className="text-gray-700 text-sm sm:text-base">{message.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between pt-0 gap-2 px-2 sm:px-4">
        <div className="text-xs text-gray-500">Day {message.day_number}</div>
        {!message.is_read && (
          <Button variant="ghost" size="sm" className="flex items-center gap-1 w-full sm:w-auto">
            <Star size={16} />
            <span>Mark as Read</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DripMessageCard;
