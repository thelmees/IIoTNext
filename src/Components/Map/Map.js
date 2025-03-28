import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css"
import locator from '../../assets/locator.png'


const Map = () => {

    const customIcon = L.icon({
        iconUrl: locator,
        iconSize: [30, 30], 
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
  return (
    <MapContainer center={[10.104086913961135, 76.37131958289879]} zoom={12} zoomControl={false} style={{ height: "270px", width: "100%" }}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[10.104086913961135, 76.37131958289879]} icon={customIcon}>
        <Popup>Dubai</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;