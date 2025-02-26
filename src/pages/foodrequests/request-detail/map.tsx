/* eslint-disable react-hooks/exhaustive-deps */
// /*global google*/
import React, { useEffect, useState } from "react";
import { compose } from "recompose";
import {
  BsFillXCircleFill,
  BsCheckCircleFill,
  BsHourglassSplit,
} from "react-icons/bs";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  DirectionsRenderer,
  Marker,
} from "react-google-maps";
import { Box, Grid, Typography } from "@mui/material";
import siteConfig from "config/site.config";

const google = (window as any).google;

interface DirectionsExampleGoogleMapProps {
  data: any;
  containerElement: JSX.Element;
}

const Map: React.FC<DirectionsExampleGoogleMapProps> = ({ data }) => {
  let source = { lat: 0, lng: 0 };
  let destination = { lat: 0, lng: 0 };
  const [directions, setDirection] = useState<any>();
  const [hideMap, setHideMap] = useState(false);

  let crd: any;
  function success(pos) {
    crd = pos && pos?.coords;
  }

  const isCancelled =
    data && (data?.status === "cancelled" || data?.status === "reject");
  const isDelivered = data && data?.status === "delivered";
  const isPending = data && data?.status === "pending";
  const isAprrove =
    data && data?.status === "approve" && data.category_slug === "fundraiser";

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, errors);

  let directionsService;
  const mapcall = () => {
    directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new google.maps.LatLng(source),
        destination: new google.maps.LatLng(destination),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirection(result);
        } else {
          // toast.error(result?.status);
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const setLocationData = async () => {
    if (data) {
      if (isCancelled || isDelivered || isPending || isAprrove) {
        setHideMap(true);
        source = {
          lat: crd && crd.latitude ? crd.latitude : 0,
          lng: crd && crd.longitude ? crd.longitude : 0,
        };
        // destination = { lat: crd && crd.latitude ? crd.latitude : 0, lng: crd && crd.longitude ? crd.longitude : 0 };
      } else if (
        data?.deliver_by_self &&
        (data?.status === "pickup" || data?.status === "donor_accept")
      ) {
        source = {
          lat: data?.donor_accept?.lat,
          lng: data?.donor_accept?.lng,
        };
        destination = {
          lat: data?.location?.coordinates[1],
          lng: data?.location?.coordinates[0],
        };
        setHideMap(false);
      } else if (data?.deliver_by_self === false) {
        if (data?.status === "pickup") {
          source = {
            lat: data?.volunteer_accept?.lat,
            lng: data?.volunteer_accept?.lng,
          };
          destination = {
            lat: data?.location?.coordinates[1],
            lng: data?.location?.coordinates[0],
          };
          setHideMap(false);
        } else if (data?.status === "volunteer_accept") {
          source = {
            lat: data?.volunteer_accept?.lat,
            lng: data?.volunteer_accept?.lng,
          };
          destination = {
            lat: data?.donor_accept?.lat,
            lng: data?.donor_accept?.lng,
          };
          setHideMap(false);
        } else if (
          data?.status === "donor_accept" ||
          data?.status === "waiting_for_volunteer"
        ) {
          source = {
            lat: data?.donor_accept?.lat,
            lng: data?.donor_accept?.lng,
          };
          destination = {
            lat: data?.donor_accept?.lat,
            lng: data?.donor_accept?.lng,
          };
          setHideMap(false);
        } else if (data?.status !== "pickup") {
          source = {
            lat: data?.volunteer_accept?.lat,
            lng: data?.volunteer_accept?.lng,
          };
          destination = {
            lat: data?.donor_accept?.lat,
            lng: data?.donor_accept?.lng,
          };
          setHideMap(false);
        }
      }
    }
  };

  useEffect(() => {
    setLocationData();
    // mapcall();
  }, [data]);

  useEffect(() => {
    setTimeout(() => {
      mapcall();
    }, 1000);
  }, [source, destination, directions, data]);

  const GoogleMapExample = compose(
    withScriptjs(
      withGoogleMap(() => (
        <GoogleMap
          defaultCenter={
            isCancelled || isDelivered || isPending || isAprrove
              ? { lat: crd && crd?.latitude, lng: crd && crd?.longitude }
              : source
          }
          defaultZoom={12}
        >
          {isCancelled || isDelivered ? (
            <Marker
              defaultPosition={{
                lat: crd && crd?.latitude && crd?.latitude,
                lng: crd && crd?.longitude && crd?.longitude,
              }}
            />
          ) : (
            <DirectionsRenderer directions={directions} />
          )}
        </GoogleMap>
      ))
    )
  );

  return (
    <Grid container spacing={4} xs={12}>
      <Grid item xs={12}>
        <div style={{ position: "relative" }}>
          {(isDelivered || isCancelled || isPending || isAprrove) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                position: "absolute",
                width: "100%",
                zIndex: 1,
                flexDirection: "column",
              }}
            >
              {isCancelled && (
                <div
                  style={{
                    fontSize: "55px",
                    lineHeight: 0,
                    color: "#d32f2f",
                    backgroundColor: "#fff",
                    borderRadius: "100%",
                    textShadow: "3px 2px 1px rgba(34, 38, 34)",
                  }}
                >
                  <BsFillXCircleFill />
                </div>
              )}
              {isDelivered && (
                <div
                  style={{
                    fontSize: "55px",
                    lineHeight: 0,
                    color: "#11c15b",
                    backgroundColor: "#fff",
                    borderRadius: "100%",
                    textShadow: "3px 2px 1px rgba(34, 38, 34)",
                  }}
                >
                  <BsCheckCircleFill />
                </div>
              )}
              {(isPending || isAprrove) && (
                <div
                  style={{ fontSize: "55px", lineHeight: 0, color: "#0288d1" }}
                >
                  <BsHourglassSplit />
                </div>
              )}
              <Typography
                variant="button"
                sx={{
                  color: isCancelled
                    ? "#d32f2f"
                    : isDelivered
                    ? "#11c15b"
                    : "#0288d1",
                  fontSize: 35,
                  opacity: 1,
                  textShadow: "3px 2px 1px rgba(34, 38, 34)",
                }}
              >
                {hideMap && isCancelled
                  ? `${
                      data?.status === "reject"
                        ? "Request rejected by Admin"
                        : "Order Cancelled"
                    }`
                  : hideMap && isDelivered
                  ? "Order Delivered"
                  : hideMap && isPending
                  ? "Request is Pending"
                  : hideMap && isAprrove
                  ? "Request is approved by Admin. Wait till donor accept request"
                  : null}
              </Typography>
            </Box>
          )}
          <GoogleMapExample
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${siteConfig.mapKey}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={
              <div
                style={{
                  height: "calc(100vh - 420px)",
                  width: "100%",
                  filter:
                    isDelivered || isCancelled || isPending || isAprrove
                      ? "blur(6px)"
                      : "blur(0px)",
                }}
              />
            }
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default Map;

// import { AppLoader } from "@crema";
// import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import React, { useEffect, useRef, ReactElement } from "react";

// interface DirectionsExampleGoogleMapProps {
//   data: any;
//   containerElement: JSX.Element;
// }

// const render = (status: Status): ReactElement => {
//   if (status === Status.LOADING) return <h3>{status} ..</h3>;
//   if (status === Status.FAILURE) return <h3>{status} ...</h3>;
//   return <AppLoader />;
// };

// function MyMapComponent({
//   center,
//   zoom,
// }: {
//   center: google.maps.LatLngLiteral;
//   zoom: number;
// }) {
//   const ref = useRef<any>();

//   useEffect(() => {
//     new window.google.maps.Map(ref.current, {
//       center,
//       zoom,
//     });
//   });

//   return <div ref={ref} id="map" />;
// }

// const Map: React.FC<DirectionsExampleGoogleMapProps> = ({ data }) => {
//   const center = { lat: -34.397, lng: 150.644 };
//   const zoom = 4;

//   return (
//     <Wrapper apiKey="https://maps.googleapis.com/maps/api/js?key=AIzaSyCpPGFmCnYP3Var-38W9cHWVuNtjJqw-IM&v=3.exp&libraries=geometry,drawing,places" render={render}>
//       <MyMapComponent center={center} zoom={zoom} />
//     </Wrapper>
//   );
// };

// export default Map;
