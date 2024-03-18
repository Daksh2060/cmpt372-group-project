import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Mapdata from "./stops.txt";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster-src.js";
import "leaflet.markercluster/src/MarkerCluster.js";
import "leaflet.markercluster/src/MarkerCluster.Spiderfier.js";

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

    var markers = L.markerClusterGroup();

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
          markers.addLayer(
            L.marker([parseFloat(stop_lat), parseFloat(stop_lon)]).bindPopup(
              `<b>${stop_name}</b>`
            )
          );
        });
      })
      .catch((error) => console.error("Error fetching data:", error));

    map.addLayer(markers);
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "850px", width: "1650px" }}></div>;
};

export default MapComponent;
