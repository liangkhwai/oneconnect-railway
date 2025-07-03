import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  useMap,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { usePlaces } from "../api/placesApi";
import { useNamphraeMarkers } from "../../marker/api/markerApi";
import L from "leaflet";
import { Modal } from "antd";

const NamphraePage = () => {
  const [mapZoom, setMapZoom] = useState(11);
  const [position, setPosition] = useState([15.87, 100.9925]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const {
    data: placeData,
    isLoading: isLoadingPlace,
    isError: isErrorPlace,
    error: errorPlace,
  } = usePlaces("67f87975bc323041be9b61d5");
  const {
    data: markersData,
    isLoading: isLoadingMarkers,
    isError: isErrorMarkers,
    error: errorMarkers,
  } = useNamphraeMarkers();

  const MapUpdater = ({ placeData, defaultPosition, defaultZoom }) => {
    const map = useMap();

    useEffect(() => {
      if (placeData && placeData.place && placeData.place.features) {
        const geoJsonLayer = L.geoJson(placeData.place.features);
        map.fitBounds(geoJsonLayer.getBounds());
      } else if (defaultPosition) {
        map.setView(defaultPosition, defaultZoom);
      }
    }, [map, placeData, defaultPosition, defaultZoom]);

    return null;
  };

  const showModal = (marker) => {
    setSelectedMarker(marker);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedMarker(null);
  };

  if (isLoadingPlace || isLoadingMarkers) return <div>Loading...</div>;
  if (isErrorPlace) return <div>Error loading place: {errorPlace.message}</div>;
  if (isErrorMarkers) return <div>Error loading markers: {errorMarkers.message}</div>;

  return (
    <div className="flex h-full">
      <div className="w-[70%] h-full">
        <MapContainer
          center={position}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Roadmap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={20}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://basemap.sphere.gistda.or.th/tiles/sphere_hybrid/EPSG3857/{z}/{x}/{y}.jpeg?key=85B54E0BD1F24BD5957582838B21094D"
                attribution="&copy; powered by <a href='https://www.gistda.or.th/'>GISTDA</a>"
                maxZoom={20}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          {placeData?.place && <GeoJSON data={placeData.place.features} />}
          {placeData?.zones && <GeoJSON data={placeData.zones.features} />}
          {markersData &&
            markersData.map((marker) => {
              const lat = marker.location?.lat;
              const lng = marker.location?.lng;
              if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
                return (
                  <Marker
                    key={marker.id}
                    position={[lat, lng]}
                    icon={L.icon({ iconUrl: marker.icon, iconSize: [25, 25] })}
                    eventHandlers={{
                      click: () => showModal(marker),
                    }}
                  />
                );
              } else {
                console.warn(`Invalid coordinates for marker ${marker.fullName}:`, lat, lng);
                return null;
              }
            })}
          <MapUpdater placeData={placeData} defaultPosition={position} defaultZoom={mapZoom} />
        </MapContainer>
      </div>
      <div className="w-[30%] bg-white p-4">
        <div className="bg-gray-100 p-4 rounded-lg h-full">
          <h2 className="text-xl font-bold mb-4">Card Space</h2>
          <p>Content for the card space.</p>
          <h3>Markers:</h3>
          <ul>
            {markersData &&
              markersData.map((marker) => (
                <li key={marker._id}>{marker.fullName}</li>
              ))}
          </ul>
        </div>
      </div>
      {selectedMarker && (
        <Modal
          title={selectedMarker.fullName}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <p>ID: {selectedMarker._id}</p>
          <p>Full Name: {selectedMarker.fullName}</p>
          <p>Citizen ID: {selectedMarker.citizenId}</p>
          {/* Add more details as needed */}
        </Modal>
      )}
    </div>
  );
};

export default NamphraePage;
