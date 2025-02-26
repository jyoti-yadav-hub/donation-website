/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, Chip, styled, Typography } from "@mui/material";
import {
  getGridBooleanOperators,
  getGridDateOperators,
  getGridNumericColumnOperators,
  getGridStringOperators,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import moment from "moment";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const TransactionLst = () => {
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const [transactionList, setTransactionList] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  //API for get transaction lists
  async function gettransactionList(nData) {
    setTransactionList((e) => ({ ...e, listsLoad: true }));
    try {
      nData.transaction_type = "donation";
      const res = await getApiData("request/admin/transaction-list", nData);
      if (res.success) {
        setTransactionList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setTransactionList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setTransactionList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(notiData)) {
      gettransactionList({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, [notiData]);

  useEffect(() => {
    gettransactionList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "createdAt",
      headerName: "Transaction Date",
      minWidth: 220,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "_id",
      headerName: "Transaction Id",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "receipt_number",
      headerName: "Receipt Number",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "campaign_name",
      headerName: "Name of Fundraiser",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "donor_name",
      headerName: "Donor Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "category_name",
      headerName: "Cause",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "goal_amount",
      headerName: "Goal Amount",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => Number(params?.row?.goal_amount).toFixed(2) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
    {
      field: "amount",
      headerName: "Amount Paid",
      minWidth: 220,
      flex: 1,
      valueGetter: (params) => Number(params?.row?.amount).toFixed(2) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
    {
      field: "tip_amount",
      headerName: "Transaction Charge",
      minWidth: 250,
      flex: 1,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
    {
      field: "tip_charge",
      headerName: "Service Charge",
      minWidth: 200,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
    },
    {
      field: "total_amount",
      headerName: "Total Amount Paid",
      minWidth: 250,
      flex: 1,
      valueGetter: (params) => Number(params?.row?.total_amount) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 220,
      flex: 1,
      filterOperators: strFilterOperators,
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
      field: "is_contribute_anonymously",
      headerName: "Is contribute anonymously?",
      minWidth: 300,
      flex: 1,
      valueGetter: (params) => params?.row?.is_contribute_anonymously || false,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            className="chip_class"
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === true
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
            }}
            label={item.value === true ? "Yes" : "No" || "-"}
            size="small"
          />
        );
      },
      filterOperators: boolFilterOperators,
    },
    // {
    //   field: "is_donor_ngo",
    //   headerName: "Donor have NGO?",
    //   minWidth: 200,
    //   flex: 1,
    //   renderCell: (item: any) => {
    //     return (
    //       <Chip
    //         className="chip_class"
    //         style={{
    //           color: "#FFF",
    //           backgroundColor:
    //             item.value === true
    //               ? "#2e7d32" //success
    //               : "#d32f2f", //error
    //         }}
    //         label={item.value === true ? "Yes" : "No" || "-"}
    //         size="small"
    //       />
    //     );
    //   },
    // },
    {
      field: "is_tax_benefit",
      headerName: "Is tax benefit?",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.is_tax_benefit || false,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            className="chip_class"
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === true
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
            }}
            label={item.value === true ? "Yes" : "No" || "-"}
            size="small"
          />
        );
      },
      filterOperators: boolFilterOperators,
    },
    {
      field: "tax_number",
      headerName: "Tax Number",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    // {
    //   field: "is_user_ngo",
    //   headerName: "Is user NGO?",
    //   minWidth: 200,
    //   flex: 1,
    //   renderCell: (item: any) => {
    //     return (
    //       <Chip
    //         className="chip_class"
    //         style={{
    //           color: "#FFF",
    //           backgroundColor:
    //             item.value === true
    //               ? "#2e7d32" //success
    //               : "#d32f2f", //error
    //         }}
    //         label={item.value === true ? "Yes" : "No" || "-"}
    //         size="small"
    //       />
    //     );
    //   },
    // },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    gettransactionList(flt);
  }

  return (
    <AppsContainer
      title="Donations"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={gettransactionList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
          />
        );
      }}
    >
      <AppsHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Donation</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>
      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={null}
        onChange={(event) => onChange(event)}
        row={transactionList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={transactionList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={gettransactionList}
        setSortModel={setSortModel}
      />
    </AppsContainer>
  );
};

export default TransactionLst;
