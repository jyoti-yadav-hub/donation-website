/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, styled, Typography } from "@mui/material";
import {
  getGridDateOperators,
  getGridStringOperators,
  GridColumns,
  GridRowsProp,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import moment from "moment";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { initialTimeFormat } from "shared/constants/AppConst";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const TransactionLst = () => {
  const [featuredList, setFeaturedList] = useState<any>({
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

  const rows: GridRowsProp = featuredList?.lists;

  //API for get transaction lists
  async function getFeaturedList(nData) {
    setFeaturedList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("request/admin/feature-payment-list", nData);
      if (res.success) {
        setFeaturedList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setFeaturedList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setFeaturedList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getFeaturedList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
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
    { field: "_id", headerName: "Transaction Id", minWidth: 200, flex: 1 },
    {
      field: "receipt_number",
      headerName: "Receipt Number",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "campaign_name",
      headerName: "Name Of Fundraiser",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "category_name",
      headerName: "Cause",
      minWidth: 200,
      flex: 1,
    },
    { field: "user_name", headerName: "User name", minWidth: 200, flex: 1 },
    {
      field: "title",
      headerName: "Plan",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.plan?.title || "-",
      type: "string",
    },
    {
      field: "plan",
      headerName: "Plan Duration",
      minWidth: 220,
      flex: 1,
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item?.value?.duration || ""} ${
              item?.value?.duration_type || ""
            }` || ""}
          </Typography>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => Number(params?.row?.amount) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item?.row?.currency || ""}${item?.row?.amount || ""}` || ""}
          </Typography>
        );
      },
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 250,
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
      field: "plan_expired_date",
      headerName: "Expiry Date",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) =>
        params?.row?.plan_expired_date
          ? moment(params?.row?.plan_expired_date).format(initialTimeFormat)
          : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "receipt_number",
      headerName: "Receipt Number",
      minWidth: 150,
      flex: 1,
    },
  ];

  const dColumns = React.useMemo(
    () =>
      columns?.map((col) => {
        return {
          ...col,
          filterOperators: getGridStringOperators().filter(({ value }) =>
            ["contains"].includes(value)
          ),
        };
      }),
    [columns]
  );

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getFeaturedList(flt);
  }

  return (
    <AppsContainer
      title="Featured List"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
    >
      <AppsHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Featured</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>
      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={null}
        onChange={(event) => onChange(event)}
        row={rows}
        column={dColumns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={featuredList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getFeaturedList}
        setSortModel={setSortModel}
      />
    </AppsContainer>
  );
};

export default TransactionLst;
