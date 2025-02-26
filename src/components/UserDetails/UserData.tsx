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
  "& .userDetails": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
    justifyContent: "flex-start",
  },
}));

interface UserDataProps {
  userDetails: any;
  from?: any;
}

const UserData: React.FC<UserDataProps> = ({ userDetails, from }) => {
  const [index, setIndex] = useState(-1);
  const onClose = () => {
    setIndex(-1);
  };
  return (
    <BodyStyle>
      <Grid item className="userDetails">
        {/* User Data View */}
        <Grid item xs={4} md={2}>
          <div className="userDataGrid">
            <Avatar
              className="avtarClass"
              src={userDetails?.image || "/assets/images/placeholder.jpg"}
              onClick={() => setIndex(userDetails?.image ? 0 : -1)}
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
                {/* {`${userDetails?.first_name || "-"} ${
                  userDetails?.last_name || "-"
                }`} */}
                {`${userDetails?.user_name || "-"} 
                `}
              </Link>
            </Typography>
          </div>
        </Grid>
        {userDetails?.blocked && (
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
                  title={userDetails?.block_account_reason || ""}
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
                    {userDetails?.block_account_reason || ""}
                  </Typography>
                </AppTooltip>
              </Box>
            </div>
          </Grid>
        )}
      </Grid>
      <MediaViewer
        index={index}
        medias={[userDetails?.image].map((data) => {
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
