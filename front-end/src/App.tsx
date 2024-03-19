//import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapComponent from "./map.tsx";
import HomePage from "./home.tsx";
import LiveTimetable from "./timetable_live.tsx";
import StaticTimetable from "./timetable_static.tsx";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/map" element={<MapComponent />}></Route>
            <Route path="/live" element={<LiveTimetable />}></Route>
            <Route path="/static" element={<StaticTimetable />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
