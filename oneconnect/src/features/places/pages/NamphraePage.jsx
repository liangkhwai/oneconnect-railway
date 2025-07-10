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
import { useNamphraeMarkers, useNamphraeCategories } from "../../marker/api/markerApi";
import L from "leaflet";
import { Modal, Image, Descriptions, Tag, Select, Button, Card } from "antd";

const NamphraePage = () => {
  const [mapZoom, setMapZoom] = useState(11);
  const [position, setPosition] = useState([15.87, 100.9925]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);

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
  } = useNamphraeMarkers(selectedCategory);

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useNamphraeCategories();

  const MapUpdater = ({
    placeData,
    defaultPosition,
    defaultZoom,
    selectedMarker,
  }) => {
    const map = useMap();

    useEffect(() => {
      const zoomOptions = { duration: 0.5 };
      if (selectedMarker) {
        const { lat, lng } = selectedMarker.location;
        if (
          typeof lat === "number" &&
          typeof lng === "number" &&
          !isNaN(lat) &&
          !isNaN(lng)
        ) {
          map.flyTo([lat, lng], 15, zoomOptions);
        }
      } else {
        if (placeData && placeData.place && placeData.place.features) {
          const geoJsonLayer = L.geoJson(placeData.place.features);
          map.flyToBounds(geoJsonLayer.getBounds(), zoomOptions);
        } else if (defaultPosition) {
          map.flyTo(defaultPosition, defaultZoom, zoomOptions);
        }
      }
    }, [map, placeData, defaultPosition, defaultZoom, selectedMarker]);

    return null;
  };

  const showModal = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCancel = () => {
    setSelectedMarker(null);
  };

  if (isLoadingPlace || isLoadingMarkers || isLoadingCategories) return <div>Loading...</div>;
  if (isErrorPlace) return <div>Error loading place: {errorPlace.message}</div>;
  if (isErrorMarkers) return <div>Error loading markers: {errorMarkers.message}</div>;
  if (isErrorCategories) return <div>Error loading categories: {errorCategories.message}</div>;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="w-full lg:w-[70%] h-full">
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
                    key={marker._id}
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
          <MapUpdater
            placeData={placeData}
            defaultPosition={position}
            defaultZoom={mapZoom}
            selectedMarker={selectedMarker}
          />
        </MapContainer>
      </div>
      <div className="w-full lg:w-[30%] bg-white p-4 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4 text-center">นามแพร่</h2>
        <Card title="กรองหมุด" style={{ marginBottom: "16px" }}>
          <Select
            placeholder="เลือกหมวดหมู่"
            allowClear
            style={{ width: "100%" }}
            onChange={(value) => setSelectedCategory(value)}
            options={categoriesData?.map((category) => ({
              label: category,
              value: category,
            }))}
            value={selectedCategory}
          />
          <Button
            type="primary"
            onClick={() => setSelectedCategory(null)}
            style={{ marginTop: "8px", width: "100%" }}
          >
            รีเซ็ตตัวกรอง
          </Button>
        </Card>
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          <Card
            title={
              selectedMarker ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={selectedMarker.icon}
                    alt="category icon"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "8px",
                    }}
                  />
                  {selectedMarker.category}
                </div>
              ) : (
                "รายละเอียดหมุด"
              )
            }
          >
            {selectedMarker ? (
              <>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="ปัญหา">
                    {selectedMarker.problems.join(", ")}
                  </Descriptions.Item>
                  <Descriptions.Item label="รายละเอียด">
                    {selectedMarker.detail}
                  </Descriptions.Item>
                  <Descriptions.Item label="สถานะ">
                    <Tag
                      color={
                        selectedMarker.status === "ดำเนินการเสร็จสิ้น"
                          ? "success"
                          : "default"
                      }
                    >
                      {selectedMarker.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="อัปเดตล่าสุด">
                    {new Date(selectedMarker.updatedAt).toLocaleString(
                      "th-TH-u-ca-gregory",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ marginBottom: "8px" }}>รูปภาพ:</h4>
                  <Image.PreviewGroup>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {selectedMarker.images.map((image, index) => (
                        <Image
                        key={index}
                        src={image}
                        style={{ maxWidth: "100px", height: "auto", objectFit: "cover" }}
                      />
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>
              </>
            ) : (
              <p>คลิกหมุดบนแผนที่เพื่อดูรายละเอียดที่นี่</p>
            )}
          </Card>
        </div>
      </div>
      {/* {selectedMarker && (
        <Modal
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={selectedMarker.icon}
                alt="category icon"
                style={{ width: "24px", height: "24px", marginRight: "8px" }}
              />
              {selectedMarker.category}
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          centered
        >
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ปัญหา">
              {selectedMarker.problems.join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="รายละเอียด">
              {selectedMarker.detail}
            </Descriptions.Item>
            <Descriptions.Item label="สถานะ">
              <Tag
                color={
                  selectedMarker.status === "ดำเนินการเสร็จสิ้น"
                    ? "success"
                    : "default"
                }
              >
                {selectedMarker.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="อัปเดตล่าสุด">
              {new Date(selectedMarker.updatedAt).toLocaleString(
                "th-TH-u-ca-gregory",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: "16px" }}>
            <h4 style={{ marginBottom: "8px" }}>รูปภาพ:</h4>
            <Image.PreviewGroup>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {selectedMarker.images.map((image, index) => (
                  <Image
                    key={index}
                    width={100}
                    height={100}
                    src={image}
                    style={{ objectFit: "cover" }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        </Modal>
      )}
      */}
    </div>
  );
};

export default NamphraePage;
