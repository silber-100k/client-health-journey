import React from "react";
import { Card } from "../../components/ui/card";

import ClinicCheckIns from "../../components/check-ins/ClinicCheckIns";

const CheckInsPage = () => {

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check-ins</h1>
        <p className="text-gray-500">Review all client check-ins</p>
      </div>

      <Card className="pl-[24px] pr-[24px]">
        <ClinicCheckIns />
      </Card>
    </div>
  );
};

export default CheckInsPage;
