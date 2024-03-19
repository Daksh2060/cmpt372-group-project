import { useParams } from "react-router-dom";

const StopSchedule = () => {
  const { stopCode } = useParams<{ stopCode: string }>();
    
  return (
    <div>
      <h1>Timetable for Bus Stop: {stopCode}</h1>
    </div>
  );
};

export default StopSchedule;
