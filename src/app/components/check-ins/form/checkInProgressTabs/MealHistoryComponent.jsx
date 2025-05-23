import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/app/components/ui/badge";
const MealHistoryComponent = ({ checkIn }) => {
  return (
    <Card className="ml-[24px] mr-[24px] p-[0px]">
      <CardHeader className=" bg-[#F9FAFB]">
        <CardTitle className="text-[14px] font-semibold pt-[24px] pb-[12px]">
          {checkIn ? format(checkIn.selectedDate, "MMMM d, yyyy") : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-[14px] pb-[24px]">
        <div className="text-[#020817] font-bold mb-[4px]">Breakfast</div>
        <div className="text-[#4B5563]  mb-[4px]">
          <span className="font-semibold">Protein:</span>{" "}
          {checkIn?.breakfastProtein}
          {" ("}
          {checkIn?.breakfastProteinPortion}oz{")"}
        </div>
        <div className="text-[#4B5563] mb-[4px]">
          <span className="font-semibold">Fruit:</span>{" "}
          {checkIn?.breakfastFruit}
          {" ("}
          {checkIn?.breakfastFruitPortion}oz{")"}
        </div>
        <div className="text-[#4B5563] mb-[8px]">
          <span className="font-semibold">Vegetable:</span>{" "}
          {checkIn?.breakfastVegetable}
          {" ("}
          {checkIn?.breakfastVegetablePortion}oz{")"}
        </div>
        <hr />

        <div className="text-[#020817] font-bold  mt-[10px] mb-[4px]">
          Lunch
        </div>
        <div className="text-[#4B5563] mb-[4px]">
          <span className="font-semibold">Protein:</span>{" "}
          {checkIn?.lunchProtein}
          {" ("}
          {checkIn?.lunchProteinPortion}oz{")"}
        </div>
        <div className="text-[#4B5563] mb-[4px]">
          <span className="font-semibold">Fruit:</span> {checkIn?.lunchFruit}
          {" ("}
          {checkIn?.lunchFruitPortion}oz{")"}
        </div>
        <div className="text-[#4B5563] mb-[8px]">
          <span className="font-semibold">Vegetable:</span>{" "}
          {checkIn?.lunchtVegetable}
          {" ("}
          {checkIn?.lunchtVegetablePortion}oz{")"}
        </div>
        <hr />

        <div className="text-[#020817] font-bold  mt-[10px] mb-[4px]">
          Dinner
        </div>
        <div className="text-[#4B5563] mb-[4px]">
          <span className="font-semibold">Protein:</span>{" "}
          {checkIn?.dinnerProtein}
          {" ("}
          {checkIn?.dinnerProteinPortion}oz{")"}
        </div>
        <div className="text-[#4B5563] mb-[4px]">
          <span className="font-semibold">Fruit:</span> {checkIn?.dinnerFruit}
          {" ("}
          {checkIn?.dinnerFruitPortion}oz{")"}
        </div>
        <div className="text-[#4B5563] mb-[8px]">
          <span className="font-semibold">Vegetable:</span>{" "}
          {checkIn?.dinnertVegetable}
          {" ("}
          {checkIn?.dinnertVegetablePortion}oz{")"}
        </div>
        <hr />
        <div className="text-[#020817] font-bold  mt-[10px]  mb-[4px]">
          Snacks
        </div>
        <div className="text-[#4B5563] mb-[4px]">
          <span className="font-semibold">Protein:</span> {checkIn?.snacks}
          {" ("}
          {checkIn?.snackPortion}oz{")"}
        </div>
        <hr />
        <div className="text-[#020817]  mt-[10px] font-bold  mb-[8px]">
          suppliments
        </div>
        <div>
          {checkIn?.supplements.split(",").map((item, index) => (
            <Badge
              className="bg-cyan-100-100 text-cyan-800 hover:bg-green-200"
              variant="outline"
              key={index}
            >
              {item.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default MealHistoryComponent;
