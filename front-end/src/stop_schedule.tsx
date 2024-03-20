import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Schedule {
  Pattern: string;
  Destination: string;
  ExpectedLeaveTime: string;
  ExpectedCountdown: number;
  ScheduleStatus: string;
}

interface Bus {
  RouteNo: string;
  RouteName: string;
  Direction: string;
  RouteMap: {
    Href: string;
  };
  Schedules: Schedule[];
}

const StopSchedule = () => {
  const { stopCode } = useParams<{ stopCode: string }>();
  const [buses, setBuses] = useState<Bus[]>([]);
  //Will hide API key later
  const apiKey = "ekBVRyPIkgOvGpyvEkKE";

  //Use translink API to fetch live data about each stop
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.translink.ca/rttiapi/v1/stops/${stopCode}/estimates?apikey=${apiKey}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBuses(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiKey]);

  return (
    <div className="buses-container">
      <h1>Buses</h1>
      {buses.map((bus, index) => (
        <div className="bus-card" key={index}>
          <h2>Route No: {bus.RouteNo}</h2>
          <p>Route Name: {bus.RouteName}</p>
          <p>Direction: {bus.Direction}</p>
          <h3>Schedules</h3>
          <ul className="schedule-list">
            {bus.Schedules.map((schedule, scheduleIndex) => (
              <li className="schedule-item" key={scheduleIndex}>
                <p>Expected Leave Time: {schedule.ExpectedLeaveTime}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default StopSchedule;
