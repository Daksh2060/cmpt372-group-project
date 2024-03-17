import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapComponent: React.FC = () => {
  useEffect(() => {
    const mapContainer = document.getElementById("map");

    if (!mapContainer) {
      console.error("Map container not found");
      return;
    }
    mapContainer.innerHTML = "";

    const map = L.map(mapContainer).setView([49.19, -122.78], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "850px", width: "1650px" }}></div>;
};

export default MapComponent;
