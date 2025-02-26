/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  styled,
  Typography,
} from "@mui/material";
import {
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
import { Link, useHistory } from "react-router-dom";
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

const SaayamTransactionList = () => {
  const history = useHistory();
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
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  //API for get transaction lists
  async function getTransactionList(nData) {
    setTransactionList((e) => ({ ...e, listsLoad: true }));
    try {
      nData.saayam_community = 1;
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

  //API for get total amount of saayam community
  async function getTotalAmount() {
    setTransactionList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("request/admin/saayam-amount", {}, "GET");
      if (res.success) {
        setTotalAmount(res?.totalAmount);
        getTransactionList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        setTransactionList((e) => ({ ...e, listsLoad: false }));
        setTotalAmount(0);
        toast.error(res.message);
      }
    } catch (error) {
      setTransactionList((e) => ({ ...e, listsLoad: false }));
      setTotalAmount(0);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getTransactionList({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
      getTotalAmount();
    }
  }, [notiData]);

  useEffect(() => {
    getTotalAmount();
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
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
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "transaction_type",
      headerName: "Transaction Type",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color:
                item?.row?.transaction_type === "ngo-donation"
                  ? "#ed6c02"
                  : item?.row?.transaction_type === "fund-donated"
                  ? "#2e7d32"
                  : "#1976d2",
              backgroundColor: "transparent",
              fontSize: 12,
            }}
            label={
              item?.row?.transaction_type === "ngo-donation"
                ? "NGO"
                : item?.row?.transaction_type === "fund-donated"
                ? "Fund"
                : item?.row?.transaction_type === "donation"
                ? "Request"
                : "-" || "-"
            }
            size="small"
          />
        );
      },
    },
    {
      field: "converted_amt",
      headerName: "Amount",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) =>
        Number(params?.row?.converted_amt).toFixed(2) || 0,
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
      field: "amount_usd",
      headerName: "USD Amount",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => Number(params?.row?.amount_usd).toFixed(2) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`$${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
    {
      field: "exchange_rate",
      headerName: "Exchange Rate",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) =>
        Number(params?.row?.exchange_rate).toFixed(4) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getTransactionList(flt);
  }

  return (
    <AppsContainer
      title="Saayam Transactions"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getTransactionList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
          />
        );
      }}
    >
      <Alert
        variant="filled"
        color="warning"
        severity="error"
        sx={{ alignItems: "center", py: 0 }}
      >
        This transactions are from Expired NGOs, Cancelled Funds & Cancelled
        Requests
      </Alert>

      <AppsHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Saayam Transactions</Typography>
            </Breadcrumbs>
          </BreadWrapper>
          <Alert
            variant="standard"
            color="info"
            severity="info"
            sx={{ alignItems: "center", py: 0 }}
          >
            {`Total amount collected by Saayam Community $${
              totalAmount?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ||
              0
            }`}
          </Alert>
        </div>
      </AppsHeader>
      <CTable
        tableStyle={{ height: "calc(100vh - 245px) !important" }}
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={(item: any) => {
          if (
            item?.row?.transaction_type === "ngo-donation" &&
            item?.row?.is_donor_ngo
          ) {
            history.push({
              pathname: `/ngo/${item?.row?.donor_id}`,
              state: { id: item?.row?.donor_id, from: "ngo-list" },
            });
          } else if (item?.row?.transaction_type === "fund-donated") {
            history.push({
              pathname: `/funds/${item?.row?.fund_id}`,
              state: { id: item?.row?.fund_id, from: "funds" },
            });
          } else if (item?.row?.transaction_type === "donation") {
            history.push({
              pathname: `/manage-requests/${item?.row?.request_id}`,
              state: item.row,
            });
          }
        }}
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
        getApiCall={getTransactionList}
        setSortModel={setSortModel}
      />
    </AppsContainer>
  );
};

export default SaayamTransactionList;
