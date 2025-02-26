import React from "react";
import AppDialog from "@crema/core/AppDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";

interface StatusModalProps {
  setStatusModal?: any;
  statusModal?: any;
  status?: any;
}

const ModalWrapper = styled(Box)(({ theme }) => ({
  maxHeight: "calc(60vh)",
  overflow: "auto",
  //   border: "1px solid #ccc",
  borderRadius: "5px",
  "& .MuiAccordion-root": {
    boxShadow: "none !important",
    marginBottom: "10px",
  },
  "& .MuiPaper-root-MuiAccordion-root.Mui-expanded": { marginBottom: "10px" },
  "& .MuiAccordionSummary-root.Mui-expanded": {
    borderBottom: "1px solid #ccc",
    margin: "0px",
    minHeight: "30px",
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: "10px 0px",
  },
}));

const StatusModal: React.FC<StatusModalProps> = ({
  statusModal,
  setStatusModal,
  status,
}) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleClose = () => {
    setStatusModal(false);
  };

  return (
    <AppDialog
      maxWidth={"md"}
      open={statusModal}
      onClose={handleClose}
      title={"Status"}
    >
      <ModalWrapper>
        {status &&
          status?.map((item: any) => {
            return (
              <Accordion
                expanded={expanded === item?._id}
                onChange={handleChange(item?._id)}
                sx={{ border: "1px solid #ccc" }}
              >
                <AccordionSummary
                  sx={{ backgroundColor: "#FCFCF9" }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ flexShrink: 0 }}>
                    {item?.date
                      ? moment(item?.date).format(initialTimeFormat)
                      : "-"}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item?.status || "-"}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </ModalWrapper>
    </AppDialog>
  );
};

export default StatusModal;
