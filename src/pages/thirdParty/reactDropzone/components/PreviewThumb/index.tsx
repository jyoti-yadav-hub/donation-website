import React, { useState } from "react";
import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { isEmpty } from "@firebase/util";
import MediaViewer from "@crema/core/AppMedialViewer";
import { PictureAsPdfOutlined } from "@mui/icons-material";

interface PreviewThumbProps {
  file?: any;
  sxStyle?: SxProps;
  btnStyle?: SxProps;
  onDeleteUploadFile: (file: any) => void;
  isEdit?: boolean;
  fileExt?: any;
}

const PreviewThumb: React.FC<PreviewThumbProps> = ({
  file,
  onDeleteUploadFile,
  sxStyle,
  btnStyle,
  isEdit,
  fileExt,
}) => {
  const imgAray = ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG"];
  const [index, setIndex] = useState(-1);
  const [filesData, setFilesData] = useState<any>([]);

  const onClose = () => {
    setFilesData([]);
    setIndex(-1);
  };

  return (
    <Box
      sx={{
        ...sxStyle,
        position: "relative",
        display: "inline-flex",
        borderRadius: 2,
        border: "1px solid #eaeaea",
        marginRight: 0,
        padding: 1,
        boxSizing: "border-box",
        "& img": {
          display: "block",
          width: "100%",
          objectFit: "cover",
          height: "100%",
        },
      }}
    >
      {isEdit ? null : (
        <Box sx={{ position: "absolute", right: 0, top: 0, ...btnStyle }}>
          <DeleteOutlineOutlinedIcon
            sx={{
              color: "text.secondary",
              borderRadius: "50%",
              padding: 1,
              backgroundColor: "text.disabled",
              "&:hover, &:focus": {
                color: "warning.main",
                backgroundColor: "primary.contrastText",
              },
            }}
            onClick={() => onDeleteUploadFile(file)}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
        onClick={() => {
          if (!isEdit) {
            setFilesData(file);
            setIndex(0);
          }
        }}
      >
        {!imgAray.includes(fileExt) ? (
          <PictureAsPdfOutlined sx={{ fontSize: 50 }} />
        ) : (
          <img
            alt="preview"
            src={
              !isEmpty(file?.preview?.preview)
                ? file?.preview?.preview
                : !isEmpty(file?.preview)
                ? file?.preview
                : !isEmpty(file)
                ? file
                : file || ""
            }
          />
        )}
      </Box>
      <MediaViewer
        index={index}
        medias={[filesData]?.map((data: any) => {
          return {
            url: data,
            mime_type: "image/*",
          };
        })}
        onClose={onClose}
      />
    </Box>
  );
};

export default PreviewThumb;
