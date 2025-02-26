import React from "react";
import { Box } from "@mui/material";
import { AppCard } from "@crema";
import { Fonts } from "shared/constants/AppEnums";

interface UserProps {
  data: any;
  loading: boolean;
  title: any;
  icon?: any;
  bgColor?: any;
}

const UserDashboard: React.FC<UserProps> = ({
  data,
  loading,
  title,
  icon,
  bgColor,
}) => {
  return (
    <AppCard
      sxStyle={{
        height: 1,
        backgroundColor: bgColor,
        boxShadow: "none",
        border: `3px solid ${bgColor}`,
      }}
      contentStyle={{ px: 1 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <Box sx={{ textAlign: "center" }}>
          <Box
            component="h3"
            sx={{
              color: "text.primary",
              fontWeight: Fonts.MEDIUM,
              fontSize: 18,
            }}
          >
            {data}
          </Box>
          <Box component="p" sx={{ color: "text.secondary" }}>
            {title}
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default UserDashboard;
