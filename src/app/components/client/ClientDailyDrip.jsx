import DripMessageCard from './drip/DripMessageCard';
import DripLoadingCard from './drip/DripLoadingCard';

const ClientDailyDrip = () => {
  const loading = false;
  if (loading) {
    return <DripLoadingCard />;
  }
  const todaysDrip = {
    is_read : false,
    subject: "hello",
    content: "new message",
    day_number:"1",
  }
  return (
    <DripMessageCard message={todaysDrip} />
  );
};

export default ClientDailyDrip;
