/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import { Modal, styled, Box, Backdrop, Fade } from "@mui/material";
import { Cancel } from "@mui/icons-material";

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  borderRadius: "10px",
  "& .slideImage": {
    width: "auto",
    height: "calc(100vh - 100px)",
  },
  "& .slideBox": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    backdropFilter: "blur(5px)",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
}));

interface ImageModalProps {
  imgSrc: any;
  openImgModal: boolean;
  setOpenImgModal: any;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imgSrc,
  openImgModal,
  setOpenImgModal,
}) => {
  return (
    <Modal
      sx={{
        "& .MuiModal-root": {
          backgroundColor: "rgba(0, 0, 0, 0.9) !important",
        },
      }}
      className="dialogBoxxx"
      open={openImgModal}
      onClose={setOpenImgModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={openImgModal}>
        <BodyStyle>
          <Box className="slideBox">
            <Cancel
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                color: "#fff",
                cursor: "pointer",
                fontSize: 30,
              }}
              onClick={setOpenImgModal}
            />
            <iframe
              src={imgSrc}
              style={{ width: "calc(100vh)", height: "calc(100vh - 100px)" }}
              className="slideImage"
            />
          </Box>
        </BodyStyle>
      </Fade>
    </Modal>
  );
};

export default ImageModal;
