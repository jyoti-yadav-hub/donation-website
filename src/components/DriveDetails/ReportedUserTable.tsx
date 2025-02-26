/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  GridColumns,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid-pro";
import CTable from "components/CTable";
import { Avatar, Box, Typography } from "@mui/material";
import MediaViewer from "@crema/core/AppMedialViewer";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";

interface ReportedUsersProps {
  id?: any;
  onChange?: any;
  getUsersList?: any;
  reportedUserList?: any;
  pagination?: any;
  sortModel?: any;
  setSortModel?: any;
}

const ReportedUsers: React.FC<ReportedUsersProps> = ({
  id,
  onChange,
  getUsersList,
  reportedUserList,
  pagination,
  sortModel,
  setSortModel,
}) => {
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");

  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );
  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
      filterable: false,
    },
    {
      field: "user_image",
      headerName: "Image",
      width: 150,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          <div
            onClick={() => {
              setImgUrl(item.value);
              setIndex(item.value ? 0 : -1);
            }}
          >
            <Avatar
              sx={{
                padding: 5,
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={item.value || "/assets/images/defaultimage.png"}
                alt={"title"}
                style={{
                  borderRadius: 5,
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  maxWidth: "fit-content",
                }}
              />
            </Avatar>
          </div>
        );
      },
    },
    {
      field: "user_name",
      headerName: "Reported By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "added_time",
      filterOperators: dateFilterOperators,
      headerName: "Reported At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
  ];

  return (
    <>
      <CTable
        NewBar={() => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: { lg: "14px", xl: "15px" }, ml: "16px" }}
              >
                Reported Users
              </Typography>
            </Box>
          );
        }}
        tableStyle={{
          height: "calc(50vh) !important",
          boxShadow: "none !important",
        }}
        onRowClick={() => console.log("click")}
        onChange={(event) => onChange(event)}
        row={reportedUserList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={reportedUserList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getUsersList}
        setSortModel={setSortModel}
      />
      <MediaViewer
        index={index}
        medias={[imgUrl].map((data) => {
          return {
            url: data,
            mime_type: "image/*",
          };
        })}
        onClose={onClose}
      />
    </>
  );
};

export default ReportedUsers;
