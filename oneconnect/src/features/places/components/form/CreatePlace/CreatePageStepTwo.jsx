import toGeoJSON from "@mapbox/togeojson";
import { Dom, parseFromString } from "dom-parser";
import { Form, Input, Row, Col, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  GeoJSON,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import thailandGeoJSON from "@/shared/data/thailand.json";
import { useState, useRef, useCallback, useEffect } from "react";
import JSZip from "jszip";
import { message } from "antd";
import { useForm } from "../../../context/FormContext";

const calculateCentroid = (geojson) => {
  if (!geojson) return null;

  let totalLat = 0;
  let totalLng = 0;
  let count = 0;

  const processCoordinates = (coords) => {
    if (Array.isArray(coords[0])) {
      // It's an array of coordinates (e.g., for a LineString or Polygon ring)
      coords.forEach(processCoordinates);
    } else {
      // It's a single coordinate pair [longitude, latitude]
      totalLng += coords[0];
      totalLat += coords[1];
      count++;
    }
  };

  if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach(feature => {
      if (feature.geometry) {
        processCoordinates(feature.geometry.coordinates);
      }
    });
  } else if (geojson.type === 'Feature') {
    if (geojson.geometry) {
      processCoordinates(geojson.geometry.coordinates);
    }
  } else if (geojson.coordinates) {
    processCoordinates(geojson.coordinates);
  }

  if (count > 0) {
    return [totalLat / count, totalLng / count];
  }
  return null;
};

// New component to handle map updates
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const FeatureLabels = ({ geojson }) => {
  if (!geojson || !geojson.features) return null;

  return (
    <>
      {geojson.features.map((feature, index) => {
        const centroid = calculateCentroid(feature.geometry);
        if (!centroid || !feature.properties || !feature.properties.name) return null;

        const customIcon = L.divIcon({
          className: 'map-label',
          html: `<div style="background-color: white; padding: 2px 5px; border-radius: 3px; font-size: 12px; font-weight: bold;">${feature.properties.name}</div>`,
          iconAnchor: [0, 0],
        });

        return (
          <Marker
            key={index}
            position={centroid}
            icon={customIcon}
          />
        );
      })}
    </>
  );
};

const CreatePageStepTwo = () => {
  const { formData, updateFormData } = useForm();

  const [mapZoom, setMapZoom] = useState(6);
  const [position, setPosition] = useState(() => {
    if (formData.latitude && formData.longitude) {
      return [formData.latitude, formData.longitude];
    }
    return [15.87, 100.9925]; // Center of Thailand coordinates
  });

  const geoJsonStyle = {
    color: "black",
    weight: 1,
    fillOpacity: 0,
  };

  const kmzBoundaryStyle = {
    weight: 2,
    fillOpacity: 0.2,
  };
  const zoneBoundaryStyle = {
    color: "red",
    weight: 1,
    fillOpacity: 0.2,
  };

  const handlePlaceKmzUpload = async (file) => {
    try {
      console.log("Processing file:", file.name);
      const zip = await JSZip.loadAsync(file);

      const kmlEntry = Object.values(zip.files).find((f) =>
        f.name.endsWith(".kml")
      );
      if (!kmlEntry) {
        throw new Error("No KML file found in KMZ archive");
      }

      const kmlText = await kmlEntry.async("text");
      console.log("KML text:", kmlText);

      // Remove namespace declarations
      let cleaned = kmlText.replace(/xmlns(:\w+)?="[^"]*"/g, "");
      console.log("Cleaned KML text:", cleaned);

      // Use built-in DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleaned, "text/xml");

      // Convert to GeoJSON
      const geojson = toGeoJSON.kml(doc);
      console.log("GeoJSON:", geojson);

      updateFormData({ kmzGeoJSON: geojson });
      const centroid = calculateCentroid(geojson);
      if (centroid) {
        setPosition(centroid);
        setMapZoom(12)
      }
      return false; // Prevent default upload behavior
    } catch (e) {
      console.error("Error processing KMZ:", e);
      // message.error("Failed to parse KML document");
    }
  };
  const handleZoneKmzUpload = async (file) => {
    try {
      console.log("Processing file:", file.name);
      const zip = await JSZip.loadAsync(file);

      const kmlEntry = Object.values(zip.files).find((f) =>
        f.name.endsWith(".kml")
      );
      if (!kmlEntry) {
        throw new Error("No KML file found in KMZ archive");
      }

      const kmlText = await kmlEntry.async("text");
      console.log("KML text:", kmlText);

      // Remove namespace declarations
      let cleaned = kmlText.replace(/xmlns(:\w+)?="[^"]*"/g, "");
      console.log("Cleaned KML text:", cleaned);

      // Use built-in DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleaned, "text/xml");

      // Convert to GeoJSON
      const geojson = toGeoJSON.kml(doc);
      console.log("GeoJSON:", geojson);

      updateFormData({ zoneGeoJSON: geojson });
      const centroid = calculateCentroid(geojson);
      if (centroid) {
        setPosition(centroid);
      }
      return false; // Prevent default upload behavior
    } catch (e) {
      console.error("Error processing KMZ:", e);
      // message.error("Failed to parse KML document");
    }
  };

  function DraggableMarker() {
    const markerRef = useRef(null);
    const eventHandlers = useCallback(
      {
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const newPosition = marker.getLatLng();
            setPosition([newPosition.lat, newPosition.lng]);
            updateFormData({ latitude: newPosition.lat, longitude: newPosition.lng });
          }
        },
      },
      []
    );

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      >
        <Popup minWidth={90}>
          <span>
            {/* {Number(position[0].toFixed(4))}, {Number(position[1].toFixed(4))} */}
          </span>
        </Popup>
      </Marker>
    );
  }

  // Effect to update map center and zoom when GeoJSON data changes in formData
  useEffect(() => {
    let newCenter = null;
    let newZoom = 6; // Default zoom

    if (formData.kmzGeoJSON) {
      newCenter = calculateCentroid(formData.kmzGeoJSON);
      newZoom = 15; // Zoom for place KMZ
    } else if (formData.zoneGeoJSON) {
      newCenter = calculateCentroid(formData.zoneGeoJSON);
      // No zoom change for zone KMZ, so newZoom remains 6
    }

    if (newCenter) {
      setPosition(newCenter);
      setMapZoom(newZoom); // Update zoom based on newZoom
    } else {
      // If no KMZ is loaded, reset to default position and zoom
      setPosition([15.87, 100.9925]); // Default center
      setMapZoom(6); // Default zoom
    }
  }, [formData.kmzGeoJSON, formData.zoneGeoJSON]);

  return (
    <Row gutter={16} className="my-10">
      <Col span={12}>
        <MapContainer
          center={position}
          style={{ height: "400px", width: "100%" }}
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
                // url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                url="https://basemap.sphere.gistda.or.th/tiles/sphere_hybrid/EPSG3857/{z}/{x}/{y}.jpeg?key=85B54E0BD1F24BD5957582838B21094D"
                attribution="&copy; powered by <a href='https://www.gistda.or.th/'>GISTDA</a>"
                maxZoom={20}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <GeoJSON data={thailandGeoJSON} style={geoJsonStyle} />
          {formData.kmzGeoJSON && <GeoJSON data={formData.kmzGeoJSON} style={kmzBoundaryStyle} />}
          {formData.zoneGeoJSON && (
            <GeoJSON
              data={formData.zoneGeoJSON}
              style={zoneBoundaryStyle}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.Shot_Name) {
                  layer.bindTooltip(feature.properties.Shot_Name, {
                    permanent: false,
                    direction: "center",
                    interactive: false,
                  });
                }
              }}
            />
          )}
          {formData.kmzGeoJSON && <GeoJSON geojson={formData.kmzGeoJSON} />}
          {/* {formData.zoneGeoJSON && <FeatureLabels geojson={formData.zoneGeoJSON} />} */}
          <DraggableMarker />
          <MapUpdater center={position} zoom={mapZoom} />
        </MapContainer>
      </Col>
      <Col span={12}>
        <Form layout="vertical">
          <Form.Item label="เมือง">
            <Upload
              beforeUpload={handlePlaceKmzUpload}
              onRemove={() => updateFormData({ kmzGeoJSON: null })}
              maxCount={1}
              accept=".kmz"
            >
              <Button icon={<UploadOutlined />}>อัพโหลดไฟล์เมือง</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="ชุมชน">
            <Upload
              beforeUpload={handleZoneKmzUpload}
              onRemove={() => updateFormData({ zoneGeoJSON: null })}
              maxCount={1}
              accept=".kmz"
            >
              <Button icon={<UploadOutlined />}>อัพโหลดไฟล์ชุมชน</Button>
            </Upload>

            {/* <ZoneColorSelected
              zone={zoneData}
              onZoneChange={setColoredZoneData}
              isEdit={false}
            /> */}
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default CreatePageStepTwo;
