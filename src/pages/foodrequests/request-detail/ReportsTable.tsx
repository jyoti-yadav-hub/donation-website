import React from "react";
import { Typography, styled, Box } from "@mui/material";
import { DataGridPro, GridColumns, GridRowsProp } from "@mui/x-data-grid-pro";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";

interface ReportsProps {
  categoryList: any;
}

const BodyStyle = styled(Box)(({ theme }) => ({
  marginTop: 0,
  "& .tableDiv": {
    backgroundColor: "rgb(255, 255, 255)",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginBottom: "20px",
    "& .MuiDataGrid-main": { minHeight: "calc(35vh)", height: "100%" },
    "& .MuiDataGrid-row:hover": {
      color: `#0d91cf !important`,
      transform: "translateY(-2px)",
      backgroundColor: "rgba(10, 143, 220, 0.1)",
      transition: "all 0.2s ease 0s",
      cursor: "pointer",
    },
    "& .MuiDataGrid-virtualScrollerRenderZone, & .MuiDataGrid-virtualScrollerContent":
      { zIndex: 100001, backgroundColor: "#fff" },
    "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-overlay": {
      zIndex: 100002,
      backgroundColor: "#fff",
    },
    "& .MuiDataGrid-cell:focus": { outline: 0 },
  },
}));

const ReportsTable: React.FC<ReportsProps> = ({ categoryList }) => {
  const rows: GridRowsProp = categoryList;

  const columns: GridColumns = [
    {
      field: "user_id",
      headerName: "User Id",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "user_name",
      headerName: "Reported By",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          <Typography style={{ width: "100%", fontSize: "12px" }}>
            {item?.value || "-"}
          </Typography>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 150,
      flex: 1,
      valueGetter: (params: any) => params?.value || "-",
      disableColumnMenu: true,
    },
    {
      field: "added_time",
      headerName: "Report Time",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          <Typography style={{ width: "100%", fontSize: "12px" }}>
            {item?.value ? moment(item?.value).format(initialTimeFormat) : "-"}
          </Typography>
        );
      },
    },
  ];

  return (
    <BodyStyle>
      <div className="tableDiv">
        <DataGridPro
          pagination={true}
          rows={rows}
          paginationMode="server"
          rowCount={categoryList?.length}
          columns={columns}
          pageSize={20}
          page={categoryList?.length}
          getRowId={(row) => row.added_time || row}
          disableSelectionOnClick
          checkboxSelection={false}
        />
      </div>
    </BodyStyle>
  );
};

export default ReportsTable;
