import React, { useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  withGoogleMap,
} from "react-google-maps";
import Box from "@mui/material/Box";
import "../../../../shared/vendors/maps.css";

const google = (window as any).google;

interface PopUpInfoWindowExampleGoogleMapProps {
  center: { lat: number, lng: number };
  markers: {
    position: any;
    showInfo: any;
    infoContent: any;
  }[];
  onMarkerClick: (e: any) => void;
  onMarkerClose: (e: any) => void;
}

const PopUpInfoWindowExampleGoogleMap = withGoogleMap((props: PopUpInfoWindowExampleGoogleMapProps) => (
  <GoogleMap defaultZoom={15} center={props.center}>
    {props.markers.map((marker, index) => (
      <Marker
        defaultIcon={"/assets/images/marker.png"}
        key={index}
        position={marker.position}
        onClick={() => props.onMarkerClick(marker)}>
        {/*
          Show info window only if the 'showInfo' key of the marker is true.
          That is, when the Marker pin has been clicked and 'onCloseClick' has been
          Successfully fired.
        */}
        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>{marker.infoContent}</div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

const MapPopupInfo = () => {
  const [markers, setMarkers] = useState([
    {
      position: new google.maps.LatLng(47.646145, -122.303763),
      showInfo: false,
      infoContent: (
        <Box display="flex">
          <div>
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16">
              <path
                d="M3.5 0c-1.7 0-3 1.6-3 3.5 0 1.7 1 3 2.3 3.4l-.5 8c0
            .6.4 1 1 1h.5c.5 0 1-.4 1-1L4 7C5.5 6.4 6.5 5 6.5
            3.4c0-2-1.3-3.5-3-3.5zm10 0l-.8 5h-.6l-.3-5h-.4L11
            5H10l-.8-5H9v6.5c0 .3.2.5.5.5h1.3l-.5 8c0 .6.4 1 1 1h.4c.6 0
            1-.4 1-1l-.5-8h1.3c.3 0 .5-.2.5-.5V0h-.4z"
              />
            </svg>
          </div>
          <Box ml={4}>
            <p>UW Medical Center</p>
            <p>1959 NE Pacific St</p>
            <p>Seattle, WA 98195</p>
          </Box>
        </Box>
      ),
    },
    {
      position: new google.maps.LatLng(47.647935, -122.303763),
      showInfo: false,
      infoContent: (
        <Box display="flex">
          <div>
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16">
              <path
                d="M6 14.5c0 .828-.672 1.5-1.5 1.5S3 15.328 3 14.5 3.672
            13 4.5 13s1.5.672 1.5 1.5zM16 14.5c0 .828-.672 1.5-1.5
            1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zM16
            8V2H4c0-.552-.448-1-1-1H0v1h2l.75 6.438C2.294 8.805 2 9.368
            2 10c0 1.105.895 2 2 2h12v-1H4c-.552 0-1-.448-1-1v-.01L16 8z"
              />
            </svg>
          </div>
          <Box ml={4}>
            <p>
              University of Washington Intramural Activities (IMA) Building
            </p>
            <p>3924 Montlake Blvd NE</p>
            <p>Seattle, WA 98195</p>
          </Box>
        </Box>
      ),
    },
  ]);
  // Toggle to 'true' to show InfoWindow and re-renders Simple
  function handleMarkerClick(targetMarker) {
    setMarkers(currMarker => currMarker.map((marker) => {
      if (marker === targetMarker) {
        return {
          ...marker,
          showInfo: true,
        };
      }
      return marker;
    }),
    );
  }

  function handleMarkerClose(targetMarker) {
    setMarkers(currMarker => currMarker.map((marker) => {
      if (marker === targetMarker) {
        return {
          ...marker,
          showInfo: false,
        };
      }
      return marker;
    }),
    );
  }

  return (
    <PopUpInfoWindowExampleGoogleMap
      containerElement={
        <div className="cr-embed-responsive cr-embed-responsive-21by9" />
      }
      mapElement={<div className="cr-embed-responsive-item" />}
      center={{
        lat: 47.646935,
        lng: -122.303763,
      }}
      markers={markers}
      onMarkerClick={handleMarkerClick}
      onMarkerClose={handleMarkerClose}
    />
  );
}

export default MapPopupInfo;