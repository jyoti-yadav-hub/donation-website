import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
const { flag } = require("country-emoji");

const columns: GridColDef[] = [
  {
    field: "first_name",
    headerName: "First Name",
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: "last_name",
    headerName: "Last Name",
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
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
    type: "number",
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
    renderCell: (item?: any) => {
      return (
        <Typography sx={{ fontSize: 12 }}>
          {flag(item?.row?.phone_country_short_name) || ""}{" "}
          {`${item?.row?.phone_code || ""} ${item?.value || "-"}` || "-"}
        </Typography>
      );
    },
  },
  //   {
  //     field: "fullName",
  //     headerName: "Full name",
  //     description: "This column has a value getter and is not sortable.",
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (params: GridValueGetterParams) =>
  //       `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  //   },
];

export default function DriveContacts(props?: any) {
  const { rows } = props;
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        getRowId={(row?: any) => {
          return row?._id;
        }}
        rows={rows}
        columns={columns}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 5,
        //     },
        //   },
        // }}
        pageSize={20}
        // pageSizeOptions={[5]}
        checkboxSelection={false}
        // disableRowSelectionOnClick
      />
    </Box>
  );
}
