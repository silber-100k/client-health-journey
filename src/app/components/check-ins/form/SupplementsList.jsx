
import React from 'react';
import { Checkbox } from '../../../components/ui/checkbox';

const SupplementsList = () => {
  const suppliments = [ {
    id: "1",
    name: "aaa",
    dosage: 8,
    frequency: 3,
    time_of_day: "2012/2/2",
    description: "hello"
  }
  ]
  return (
    <div className="space-y-3">
      {supplements.map((supplement) => (
        <div key={supplement.id} className="flex items-start space-x-2 mb-3">
          <Checkbox
            id={supplement.id}
            checked={!!checkedSupplements[supplement.id]}
            onCheckedChange={(checked) => 
              onSupplementChange(supplement.id, Boolean(checked))
            }
          />
          <div className="grid gap-0.5">
            <label
              htmlFor={supplement.id}
              className="font-medium cursor-pointer"
            >
              {supplement.name}
            </label>
            <p className="text-sm text-gray-500">
              {supplement.dosage} - {supplement.frequency}
              {supplement.time_of_day && ` - ${supplement.time_of_day}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupplementsList;
