import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Mapdata from "./stops.txt";

const MapComponent = () => {
  useEffect(() => {
    const mapContainer = document.getElementById("map");

    if (!mapContainer) {
      console.error("Problem loading map");
      return;
    }

    mapContainer.innerHTML = "";

    var map = L.map("map", {
      preferCanvas: true,
    }).setView([49.19, -122.78], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    }).addTo(map);

    map.setMinZoom(11);
    map.setMaxZoom(17);

    fetch(Mapdata)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split("\n");
        rows.forEach((row) => {
          const [
            stop_id,
            stop_code,
            stop_name,
            stop_lat,
            stop_lon,
            ex,
            ex2,
            ex3,
          ] = row.split(",");
          const circleMarker = L.circleMarker([
            parseFloat(stop_lat),
            parseFloat(stop_lon),
          ]).addTo(map);
          circleMarker.bindPopup(`<b>${stop_name}</b>`);
        });
      })
      .catch((error) => console.error("Error fetching data:", error));

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "850px", width: "1650px" }}></div>;
};

export default MapComponent;
