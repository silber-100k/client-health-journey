import React from "react";
import CheckInForm from "../../components/check-ins/CheckInForm";

const CheckIn = () => {
  return (
    <div className="px-2 sm:px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check-in</h1>
        <p className="text-gray-500">
        Track your progress daily and update previous days. Save your food images and upload them once a day for complete results. That’s it! Just once a day is all you need.
        </p>
      </div>
      <CheckInForm />
    </div>
  );
};

export default CheckIn;
