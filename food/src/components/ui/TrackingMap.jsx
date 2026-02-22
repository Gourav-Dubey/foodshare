 import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      try { map.fitBounds(positions, { padding: [50, 50] }); } catch (e) {}
    }
  }, [JSON.stringify(positions)]);
  return null;
};

const AutoPan = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position?.[0] && position?.[1]) map.panTo(position);
  }, [position?.[0], position?.[1]]);
  return null;
};

const fetchRoute = async (from, to) => {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    }
  } catch (e) {
    console.warn("Route fetch failed:", e);
  }
  return null;
};

const TrackingMap = ({
  ngoLocation,
  donorLocation,
  donorAddress,
  isNgo = false,
  showRoute = false
}) => {
  const [routePoints, setRoutePoints] = useState([]);

  const validNgo = ngoLocation?.lat && ngoLocation?.lng ? ngoLocation : null;
  const validDonor = donorLocation?.lat && donorLocation?.lng ? donorLocation : null;

  useEffect(() => {
    if (showRoute && validNgo && validDonor) {
      fetchRoute(validNgo, validDonor).then(points => {
        if (points) setRoutePoints(points);
      });
    } else {
      setRoutePoints([]);
    }
  }, [
    validNgo?.lat, validNgo?.lng,
    validDonor?.lat, validDonor?.lng,
    showRoute
  ]);

  const center = (isNgo ? validDonor : validNgo) || validNgo || validDonor;

  const allPositions = [
    validNgo ? [validNgo.lat, validNgo.lng] : null,
    validDonor ? [validDonor.lat, validDonor.lng] : null,
  ].filter(Boolean);

  if (!center) {
    return (
      <div style={{
        borderRadius: 12,
        border: "1px solid rgba(74,222,128,0.2)",
        height: 220, marginTop: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "rgba(5,18,11,0.6)",
        color: "rgba(187,247,208,0.4)", fontSize: 13, gap: 8
      }}>
        <span style={{ fontSize: 28 }}>🗺️</span>
        <span>Location fetch ho rahi hai...</span>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: 12, overflow: "hidden",
      border: "1px solid rgba(74,222,128,0.3)",
      height: 300, marginTop: 10
    }}>
      <MapContainer
        key={`map-${center.lat?.toFixed(3)}-${center.lng?.toFixed(3)}`}
        center={[center.lat, center.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {/* Dono markers hain toh bounds fit karo */}
        {allPositions.length >= 2 && <FitBounds positions={allPositions} />}

        {/* Blue route line — Rapido/Google Maps jaisi */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            color="#3b82f6"
            weight={5}
            opacity={0.9}
          />
        )}

        {/* NGO — green marker */}
        {validNgo && (
          <>
            <Marker position={[validNgo.lat, validNgo.lng]} icon={greenIcon}>
              <Popup>🚗 NGO ki location</Popup>
            </Marker>
            {/* Sirf donor ko NGO follow karna hai */}
            {!isNgo && <AutoPan position={[validNgo.lat, validNgo.lng]} />}
          </>
        )}

        {/* Donor — red marker */}
        {validDonor && (
          <Marker position={[validDonor.lat, validDonor.lng]} icon={redIcon}>
            <Popup>📍 Pickup: {donorAddress || "Donor location"}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default TrackingMap;