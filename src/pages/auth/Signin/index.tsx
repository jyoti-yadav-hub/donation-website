import React from "react";
import Box from "@mui/material/Box";
import SigninFirebase from "./SigninFirebase";
import AppLogo from "@crema/core/AppLayout/components/AppLogo";
import CSS from "csstype";
import { Card, Grid, useTheme } from "@mui/material";
import { ReactComponent as Logo } from "../../../assets/user/login.svg";
import { AppAnimate } from "@crema";

const glassmorphism: CSS.Properties = {
  backgroundColor: "rgb(255 255 255 / 59%)",
  borderRadius: "10px",
  boxShadow: "rgb(221 221 221 / 37%) 0px 8px 32px 0px",
  borderWidth: "1px",
  borderColor: "rgba( 255, 255, 255, 0.18 )",
  backdropFilter: "blur( 5px )",
};
const Signin = () => {
  const theme = useTheme();
  return (
    <AppAnimate animation="transition.slideUpIn" delay={200}>
      <Box
        sx={{
          pb: 6,
          py: { xl: 8 },
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={glassmorphism}
          sx={{
            maxWidth: 1024,
            width: "100%",
            padding: 8,
            paddingLeft: { xs: 8, md: 2 },
            overflow: "hidden",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Grid container spacing={5} sx={{ alignItems: "center" }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                width: "100%",
                height: "100%",
                textAlign: "center",
                "& svg": {
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  paddingRight: { xs: 0, lg: 10 },
                },
              }}
            >
              <Logo fill={theme.palette.primary.main} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
              <Box sx={{ mb: 5, display: "flex", justifyContent: "center" }}>
                <AppLogo
                  sxStyle={{
                    height: { xs: 80, sm: 80 },
                    width: { xs: 185, sm: 185 },
                  }}
                />
              </Box>

              <SigninFirebase />
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default Signin;
