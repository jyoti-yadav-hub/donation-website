import React from "react";
import NoInternet from "@crema/Lotties/NoInternet.json";
import CSS from "csstype";
import { Box } from "@mui/system";
import Lottie from "lottie-react";
import { Typography } from "@mui/material";

const glassmorphism: CSS.Properties = {
  backgroundColor: "rgb(255 255 255 / 59%)",
  borderRadius: "10px",
  boxShadow: "rgb(221 221 221 / 37%) 0px 8px 32px 0px",
  borderWidth: "1px",
  borderColor: "rgba( 255, 255, 255, 0.18 )",
  backdropFilter: "blur( 5px )",
};

const NoInternetComponent = () => {
  return (
    <Box className="centerDiv" style={glassmorphism}>
      <Box sx={{ p: 8 }}>
        <Lottie
          loop={true}
          autoPlay={true}
          animationData={NoInternet}
          style={{ width: "100%", height: "auto", marginBottom: 10 }}
        />
        <Typography style={{ fontSize: 18 }}>
          No Internet Connection. Check your network
        </Typography>
        <Typography style={{ fontSize: 18 }}>
          You may also refresh the page or try again Later
        </Typography>
      </Box>
    </Box>
  );
};

export default NoInternetComponent;
