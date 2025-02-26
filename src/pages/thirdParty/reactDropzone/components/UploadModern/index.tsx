import React from "react";
import Box from "@mui/material/Box";
import { TiFolderOpen } from "react-icons/ti";
import { useThemeContext } from "@crema/utility/AppContextProvider/ThemeContextProvider";
import { SxProps } from "@mui/system";

interface UploadModernProps {
  uploadText: string;
  infoMsg?: string;
  dropzone: any;
  iconHide?: any;
  sxStyle?: SxProps;
}

const UploadModern: React.FC<UploadModernProps> = ({
  uploadText,
  dropzone,
  infoMsg,
  iconHide,
  sxStyle,
}) => {
  const { theme } = useThemeContext();
  return (
    <Box
      sx={{
        position: "relative",
        "& ul": { listStyle: "none", padding: 0 },
      }}
    >
      <Box
        {...dropzone.getRootProps({ className: "dropzone" })}
        sx={{
          cursor: "pointer",
          border: (theme) => `dashed 2px ${theme.palette.divider}`,
          borderRadius: iconHide ? 1.5 : 2.5,
          p: iconHide ? 1 : 5,
          textAlign: "center",
          mb: iconHide ? 0 : 4,
          color: "text.secondary",
          backgroundColor: "background.default",
          height: iconHide ? 30 : "auto",
          ...sxStyle,
        }}
      >
        <input {...dropzone.getInputProps()} />
        {iconHide ? null : (
          <TiFolderOpen
            style={{
              fontSize: 40,
              marginBottom: 4,
              color: theme.palette.primary.main,
            }}
          />
        )}
        <p>{uploadText}</p>
        <p style={{ color: "rgb(1, 67, 97)", fontSize: 12, marginTop: 5 }}>
          {infoMsg}
        </p>
      </Box>
    </Box>
  );
};

export default UploadModern;
