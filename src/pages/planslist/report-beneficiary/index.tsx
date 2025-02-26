import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import { Fonts } from "../../../shared/constants/AppEnums";

interface ReportsProps {
  reportsLists: any;
}

const ReportsLists: React.FC<ReportsProps> = ({ reportsLists }) => {
  return (
    <Box
      sx={{
        height: "100%",
        maxHeight: "calc(100vh - 150px)",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {reportsLists &&
        reportsLists.length > 0 &&
        reportsLists.map((item: any) => {
          return (
            <Accordion
              key={item?.user_id}
              sx={{
                color: "text.secondary",
                marginBottom: 0.5,
                padding: "10px 20px",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                sx={{
                  fontWeight: Fonts.MEDIUM,
                  color: "text.primary",
                  fontSize: 16,
                  padding: 0,
                }}
                expandIcon={<ExpandMoreIcon />}
              >
                <Box>Reported By: {item?.user_name || "-"}</Box>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: "0 0 10px" }}>
                <Box>Description: {item?.description || "-"}</Box>
                <Box>Time: {item?.added_time || "-"}</Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Box>
  );
};

export default ReportsLists;
