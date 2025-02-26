import React, { useState } from "react";
import { Avatar, AvatarGroup, Box, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import MediaViewer from "@crema/core/AppMedialViewer";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CTable from "components/CTable";
import { isEmpty } from "lodash";
import { GridColumns } from "@mui/x-data-grid-pro";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
const { flag } = require("country-emoji");

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  "& .top-userdata": {
    boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    backgroundColor: "rgb(255, 255, 255)",
    padding: 15,
    flexWrap: "wrap",
    borderRadius: "10px !important",
  },
}));

interface UpdateRemoveTrusteeProps {
  ngoDetail: any;
}

const UpdateRemoveTrustee: React.FC<UpdateRemoveTrusteeProps> = ({
  ngoDetail,
}) => {
  const [fileType, setFileType] = useState<any>("");
  const [filesData, setFilesData] = useState<any>([]);
  const [itemIndex, setIndex] = useState<any>(-1);
  let FileURLdata = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "svg", "SVG"];

  const onClose = () => {
    setFilesData([]);
    setIndex(-1);
  };

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
      filterable: false,
    },
    {
      field: "first_name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (item?: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.value || ""} {item?.row?.last_name || ""}
          </Typography>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (item?: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {flag(item?.row?.country_code) || ""}{" "}
            {`${item?.row?.phone_code || ""} ${item?.value || "-"}` || "-"}
          </Typography>
        );
      },
    },
    {
      field: "added_time",
      disableColumnMenu: true,
      headerName: "Added At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
    },
    {
      field: "removed_time",
      disableColumnMenu: true,
      headerName: "Removed At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
    },
    {
      field: "documents",
      headerName: "Documents",
      disableColumnMenu: true,
      minWidth: 200,
      flex: 1,
      renderCell: (item?: any) => {
        return (
          <AvatarGroup max={2}>
            {item?.value?.map((slide?: any, index?: any) => {
              let extension = slide.split(".").pop();
              return (
                <div
                  key={index}
                  onClick={() => {
                    setFilesData(item?.value);
                    setIndex(index);
                    setFileType(extension);
                  }}
                >
                  <Avatar variant="circular" sx={{ cursor: "pointer" }}>
                    <AssignmentIcon />
                  </Avatar>
                </div>
              );
            })}
          </AvatarGroup>
        );
      },
    },
  ];

  return (
    <BodyStyle>
      <Box className="top-userdata" style={{ height: "100%" }}>
        <Typography
          variant="body2"
          sx={{ fontSize: { lg: "14px", xl: "15px" } }}
        >
          Previous Trustee:
        </Typography>
        {!isEmpty(ngoDetail?.updated_data?.removed_trustee) ? (
          <CTable
            tableStyle={{
              height: "calc(30vh) !important",
              boxShadow: "none !important",
            }}
            onRowClick={() => console.log("click")}
            row={ngoDetail?.updated_data?.removed_trustee}
            column={columns}
            rowCount={ngoDetail?.updated_data?.removed_trustee?.length}
            listsLoad={false}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
          />
        ) : (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: ngoDetail?.updated_data ? "110px" : "150px",
            }}
          >
            <Typography variant="button" sx={{ fontSize: { md: "16px" } }}>
              No Data
            </Typography>
          </Grid>
        )}
      </Box>

      <MediaViewer
        index={itemIndex}
        medias={filesData?.map((data: any) => {
          return {
            url: data,
            mime_type: FileURLdata.includes(fileType)
              ? "image/*"
              : "docs" || "image/*",
          };
        })}
        onClose={onClose}
      />
    </BodyStyle>
  );
};

export default UpdateRemoveTrustee;
