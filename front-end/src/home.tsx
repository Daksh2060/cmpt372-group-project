import { useNavigate } from "react-router";

const HomePage = () => {

  const navigate = useNavigate();

  const handleMap = () => {
    navigate("/map");
  };

  const handleStaticTimetable = () => {
    navigate("/static");
  };

  const handleLiveTimetable = () => {
    navigate("/live");
  };

  //Temp homepage for accessing available components
  return (
    <div className="homepage-container">
      <h1>Homepage</h1>
      <div className="button-container">
        <button onClick={handleMap}>GO TO MAP</button>
        <button onClick={handleStaticTimetable}>GO TO STATIC TIME TABLE</button>
        <button onClick={handleLiveTimetable}>GO TO LIVE TIME TABLE</button>
      </div>
    </div>
  );
};

export default HomePage;
