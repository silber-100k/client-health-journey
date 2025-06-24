import ClientDailyDrip from "../../components/client/ClientDailyDrip";
import ProgramProgress from "../../components/client/ProgramProgress";
import LatestStats from "../../components/client/LatestStats";
import QuickActions from "../../components/client/QuickActions";

const ClientDashboard = () => {
  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto">
      {/* Daily motivation message */}
      <ClientDailyDrip />

      {/* Program progress */}
      {/* <ProgramProgress /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-4 w-full">
        {/* Latest stats */}
        <LatestStats />

        {/* Quick actions */}
        <QuickActions />
      </div>
    </div>
  );
};

export default ClientDashboard;
