import React from "react";
import moment from "moment";
import { getGridDateOperators, GridColumns } from "@mui/x-data-grid-pro";
import { Typography } from "@mui/material";
import { initialTimeFormat } from "shared/constants/AppConst";
import CTable from "components/CTable";

interface DonationListProps {
  pagination: any;
  getDonorsList: any;
  donorsList: any;
  sortModel?: any;
  setSortModel?: any;
}

const DonationListTable: React.FC<DonationListProps> = ({
  pagination,
  getDonorsList,
  donorsList,
  sortModel,
  setSortModel,
}) => {
  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    getDonorsList(flt);
  }

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const columns: GridColumns = [
    { field: "_id", headerName: "ID", hide: true, filterable: false },
    {
      field: "createdAt",
      headerName: "Donate At",
      width: 200,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "receipt_number",
      headerName: "Receipt Number",
      minWidth: 200,
      flex: 1,
    },
    // {
    //   field: "donor_id",
    //   headerName: "Donor Reference ID",
    //   minWidth: 200,
    //   flex: 1,
    //   type: "number",
    // },
    { field: "donor_name", headerName: "Donor", minWidth: 200, flex: 1 },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 200,
      flex: 1,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12, textAlign: "center", width: "100%" }}>
            {item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1) ||
              "-"}
          </Typography>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount Paid",
      minWidth: 200,
      flex: 1,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${
              item.value?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ||
              ""
            }`}
          </Typography>
        );
      },
    },
  ];

  return (
    <CTable
      tableStyle={{ height: "calc(50vh) !important" }}
      onRowClick={() => console.log("click")}
      onChange={(event) => onChange(event)}
      row={donorsList?.lists}
      column={columns}
      rowCount={pagination.total}
      page={pagination.page}
      listsLoad={donorsList?.listsLoad}
      checkboxSelection={false}
      onSelectionModelChange={() => console.log("row select")}
      sortModel={sortModel}
      getApiCall={getDonorsList}
      setSortModel={setSortModel}
    />
  );
};

export default DonationListTable;
