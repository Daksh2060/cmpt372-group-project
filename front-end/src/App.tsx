//import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BusStopMap from "./map.tsx"
import HomePage from "./home.tsx"

function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/map" element={<BusStopMap />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
