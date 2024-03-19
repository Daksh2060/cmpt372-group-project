import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
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

const MapComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [map, setMap] = useState<L.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

    const leafletIcon = L.icon({
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Canberra_Bus_icon.svg/2048px-Canberra_Bus_icon.svg.png",
      iconSize: [30, 30],
    });

    const markers = L.markerClusterGroup();

    fetch(Mapdata)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split("\n");
        rows.forEach((row) => {
          const [_stop_id, stop_code, stop_name, stop_lat, stop_lon] =
            row.split(",");
          if (
            stop_name &&
            stop_name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            const marker = L.marker(
              [parseFloat(stop_lat), parseFloat(stop_lon)],
              {
                icon: leafletIcon,
              }
            ).bindPopup(
              `<b>${stop_name}</b><br/><a href="">Bus Timetable</a>`
            );
            marker.on("popupopen", () => {
              const linkElement = document.querySelector(
                ".leaflet-popup-content a"
              );
              if (linkElement) {
                linkElement.addEventListener("click", () => {
                  const stopCode = encodeURIComponent(stop_code);
                  navigate(`/schedule/${stopCode}`);
                });
              }
            });
            markers.addLayer(marker);
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
  //Setup temp css and class names later
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
        placeholder="Filter stops by name..."
      />
    </div>
  );
};

export default MapComponent;
