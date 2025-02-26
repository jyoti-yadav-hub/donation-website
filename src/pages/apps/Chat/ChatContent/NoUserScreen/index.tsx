import React from "react";
import { Typography } from "@mui/material";
import IntlMessages from "@crema/utility/IntlMessages";
import SpeakerNotesOutlinedIcon from "@mui/icons-material/SpeakerNotesOutlined";
import { styled } from "@mui/material/styles";
import { Fonts } from "shared/constants/AppEnums";

const ScrollChatNoUser = styled("div")(({ theme }) => {
  return {
    fontSize: 18,
    padding: 16,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    height: "calc(100vh - 210px) !important",
    fontWeight: Fonts.MEDIUM,
    [theme.breakpoints.up("lg")]: {
      fontSize: 20,
    },
    "& .MuiSvgIcon-root": {
      fontSize: "3rem",
      color: "#BDBDBD",
      [theme.breakpoints.up("lg")]: {
        fontSize: "5rem",
      },
    },
  };
});

const NoUserScreen = () => {
  return (
    <ScrollChatNoUser>
      <SpeakerNotesOutlinedIcon />
      <Typography>
        <IntlMessages id="chatApp.noCategorySelect" />
      </Typography>
    </ScrollChatNoUser>
  );
};

export default NoUserScreen;
