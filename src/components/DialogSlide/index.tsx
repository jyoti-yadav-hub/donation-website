import React, { ReactNode } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Fonts } from "shared/constants/AppEnums";
import { HighlightOff } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  // eslint-disable-next-line no-undef
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AppConfirmDialogProps {
  dialogTitle: string | ReactNode;
  open: boolean;
  onDeny: any;
  children: any;
  dialogContentStyle?: any;
  onClose?: any;
}

const DialogSlide: React.FC<AppConfirmDialogProps> = ({
  open,
  onDeny,
  dialogTitle,
  children,
  dialogContentStyle,
  onClose,
}) => {
  return (
    <Dialog
      sx={{ zIndex: 1000002, ...dialogContentStyle }}
      TransitionComponent={Transition}
      open={open}
      onClose={onDeny}
    >
      <DialogTitle>
        <Typography
          align="center"
          component="h4"
          variant="h4"
          sx={{ fontWeight: Fonts.SEMI_BOLD }}
          id="alert-dialog-title"
        >
          {dialogTitle}
        </Typography>
        <Box sx={{ position: "absolute", top: "5px", right: "5px" }}>
          <IconButton size="medium" onClick={onClose}>
            <HighlightOff />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          color: "text.secondary",
          fontSize: 14,
          p: "20px !important",
        }}
        id="alert-dialog-description"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogSlide;
