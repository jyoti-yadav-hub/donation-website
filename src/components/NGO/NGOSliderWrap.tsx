import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";

interface NGOSliderWrapProps {
  children: ReactNode;
}

const NGOSliderWrap: React.FC<NGOSliderWrapProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        "& .top-userdata": {
          boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
          backgroundColor: "rgb(255, 255, 255)",
          padding: 20,
          flexWrap: "wrap",
          borderRadius: "10px !important",
        },
        "& .slideImage": {
          width: "100% !important",
          objectFit: "contain",
        },
        "& .slick-slider": {
          display: "grid",
          width: "100%",
          alignItems: "center",
          borderRadius: "10px",
        },
        "& .slideBox": {
          width: "auto",
          display: "flex !important",
          overflow: "hidden",
          alignItems: "center !important",
          justifyContent: "center !important",
          [theme.breakpoints.down("xl")]: {
            maxHeight: "calc(26vh) !important",
          },
        },
        "& .noImageClass": {
          objectFit: "cover",
        },
        "& .noFileDiv": { textAlign: "center" },
      }}
    >
      {children}
    </Box>
  );
};

export default NGOSliderWrap;
