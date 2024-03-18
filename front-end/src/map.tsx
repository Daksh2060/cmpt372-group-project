import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Mapdata from "./stops.txt";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster-src.js";
import "leaflet.markercluster/src/MarkerCluster.js";
import "leaflet.markercluster/src/MarkerCluster.Spiderfier.js";
import "leaflet.markercluster/src/MarkerCluster.QuickHull.js";
import "./App.css";

const MapComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [map, setMap] = useState<L.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const leafletMap = L.map(mapContainer.current, {
      preferCanvas: true,
    }).setView([49.2, -122.92], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    }).addTo(leafletMap);

    leafletMap.setMinZoom(11);
    leafletMap.setMaxZoom(17);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    const markers = L.markerClusterGroup();

    fetch(Mapdata)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split("\n");
        rows.forEach((row) => {
          const [stop_id, stop_code, stop_name, stop_lat, stop_lon] =
            row.split(",");
          if (
            stop_name &&
            stop_name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            markers.addLayer(
              L.marker([parseFloat(stop_lat), parseFloat(stop_lon)]).bindPopup(
                `<b>${stop_name}</b><br/><a href="">Bus Timetable</a>`
              )
            );
          }
        });
      })
      .catch((error) => console.error("Error fetching data:", error));

    map.addLayer(markers);

    return () => {
      map.removeLayer(markers);
    };
  }, [map, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <div
        ref={mapContainer}
        style={{ height: "850px", width: "1650px", margin: "auto" }}
      ></div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for a bus stop..."
      />
    </div>
  );
};

export default MapComponent;
