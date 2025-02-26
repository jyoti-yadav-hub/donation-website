import React from "react";
import Box from "@mui/material/Box";
import { Avatar, Typography } from "@mui/material";

interface CardProps {
  data: any;
  getIcon: any;
  title: any;
}

const Card: React.FC<CardProps> = ({ getIcon, data, title }) => {
  return (
    <Box
      sx={{
        borderRadius: 4,
        padding: "10px",
        "&:hover": {
          transform: "scale(1.01)",
          transition: "all 0.2s ease",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 15%)",
        },
        backgroundColor: "#e6f4fb",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box>
          <Avatar
            sx={{
              height: 35,
              width: 35,
              backgroundColor: "#fff",
              padding: "25px",
            }}
          >
            {getIcon((icon) => {
              return icon;
            })}
          </Avatar>
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h2" sx={{ color: "rgb(10, 143, 220)" }}>
            {data}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "rgb(10, 143, 220)",
              fontSize: { xs: "12px", sm: "13px", md: "14px" },
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
