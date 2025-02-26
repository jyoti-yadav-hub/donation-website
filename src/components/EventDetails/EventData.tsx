import React, { useState } from "react";
import { Alert, Avatar, Box, Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AppTooltip from "@crema/core/AppTooltip";
import MediaViewer from "@crema/core/AppMedialViewer";

const BodyStyle = styled(Box)(({ theme }) => ({
  "& .userDataGrid": {
    // boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    backgroundColor: "rgb(244, 247, 254)",
    padding: 15,
    borderRadius: "10px !important",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    margin: 5,
  },
  "& .avtarClass": {
    height: 100,
    width: 100,
    fontSize: 20,
    backgroundColor: "#17a2da",
    cursor: "pointer",
  },
  "& .eventDetails": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
    justifyContent: "flex-start",
  },
}));

interface UserDataProps {
  eventDetails: any;
  from?: any;
}

const UserData: React.FC<UserDataProps> = ({ eventDetails, from }) => {
  const [index, setIndex] = useState(-1);
  const onClose = () => {
    setIndex(-1);
  };
  return (
    <BodyStyle>
      <Grid item className="eventDetails">
        {/* User Data View */} {console.log(eventDetails)}
        <Grid item xs={4} md={2}>
          <div className="userDataGrid">
            <Avatar
              className="avtarClass"
              src={
                eventDetails?.cover_photo || "/assets/images/placeholder.jpg"
              }
              onClick={() => setIndex(eventDetails?.cover_photo ? 0 : -1)}
            />
            {/* User Name */}
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              <Link
                sx={{
                  fontSize: { lg: "13px", xl: "14px" },
                  fontWeight: "500",
                  maxHeight: "20px",
                  overflow: "hidden",
                  maxWidth: "300px",
                  mt: 1,
                }}
                component="button"
                variant="body2"
                underline="none"
                color={from === "active-user" ? "inherit" : "primary"}
              >
                {`${eventDetails.form_data?.what_s_your_event || "-"} `}
              </Link>
            </Typography>
          </div>
        </Grid>
        {eventDetails?.blocked && (
          <Grid item xs={4} md={4}>
            <div className="userDataGrid">
              <Alert
                color="error"
                sx={{ alignItems: "center", width: "100%", mb: 2 }}
              >
                This user is Blocked by Admin
              </Alert>
              <Box sx={{ width: "100%", display: "flex" }}>
                <Typography>Reason:</Typography>
                <AppTooltip
                  title={eventDetails?.blocked_account_reason || ""}
                  placement={"right"}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "text.secondary",
                      fontSize: "15px",
                      lineHeight: "1.43",
                      fontWeight: "500",
                      paddingLeft: 2,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 4,
                    }}
                  >
                    {eventDetails?.blocked_account_reason || ""}
                  </Typography>
                </AppTooltip>
              </Box>
            </div>
          </Grid>
        )}
      </Grid>
      <MediaViewer
        index={index}
        medias={[eventDetails?.image].map((data) => {
          return {
            url: data,
            mime_type: "image/*",
          };
        })}
        onClose={onClose}
      />
    </BodyStyle>
  );
};

export default UserData;
